"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../business/BusinessContext';
import { toast } from '../ui/use-toast';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

interface TextTrainSessionProps {
  onTrainingStatusChange: (isTraining: boolean) => void;
}

const TextTrainSession: React.FC<TextTrainSessionProps> = ({ onTrainingStatusChange }) => {
  const [trainingMode, setTrainingMode] = useState<'guided' | 'random' | null>(null);
  const [guidedConversations, setGuidedConversations] = useState<{ question: string, answer: string }[]>([]);
  const [randomText, setRandomText] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [showFullText, setShowFullText] = useState<boolean>(false);
  const [showFullTextarea, setShowFullTextarea] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { currentChatbot } = useChatbot();

  const handleAddGuidedConversation = () => {
    if (currentQuestion && currentAnswer) {
      setGuidedConversations([...guidedConversations, { question: currentQuestion, answer: currentAnswer }]);
      setCurrentQuestion('');
      setCurrentAnswer('');
    }
  };

  const handleTrain = async () => {
    if (!currentChatbot) {
      toast({ title: "No chatbot selected", variant: "destructive" });
      return;
    }

    setLoading(true);
    onTrainingStatusChange(true); // Indicate training has started
    setTrainingProgress(0);
    try {
      let response;
      if (trainingMode === 'guided') {
        response = await fetch("https://geneline-x-main-pipeline.vercel.app/chatbot-upload/text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chatbotName: currentChatbot.name, 
            mode: 'guided', 
            conversations: guidedConversations
          })
        });
      } else if (trainingMode === 'random') {
        response = await fetch("https://geneline-x-main-pipeline.vercel.app/chatbot-upload/text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: randomText, 
            chatbotName: currentChatbot.name, 
            mode: 'random'
          })
        });
      }
      if (response?.ok) {
        await simulateTraining();
        toast({ title: trainingMode === 'guided' ? "Conversations added" : "Data added" });
      } else {
        toast({ title: "Error training chatbot", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error training chatbot", variant: "destructive" });
      console.error('Error training chatbot:', error);
    } finally {
      setLoading(false);
      onTrainingStatusChange(false); // Indicate training has finished (success or error)
    }
  };

  const simulateTraining = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setLoading(false);
      }
      setTrainingProgress(progress);
    }, 500);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = showFullTextarea ? 'auto' : '100px';
      if (showFullTextarea) {
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  }, [showFullTextarea, randomText]);

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Button 
          onClick={() => setTrainingMode('guided')} 
          variant={trainingMode === 'guided' ? 'default' : 'outline'}
        >
          Guided Conversation
        </Button>
        <Button 
          onClick={() => setTrainingMode('random')} 
          variant={trainingMode === 'random' ? 'default' : 'outline'}
        >
          Random Text
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {trainingMode === 'guided' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Input
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="Enter question"
              className="w-full"
            />
            <Input
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Enter answer"
              className="w-full"
            />
            <Button onClick={handleAddGuidedConversation}>
              Add Conversation
            </Button>

            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Conversations:</h4>
              <ul className="space-y-2">
                {guidedConversations.map((conv, index) => (
                  <li key={index} className="bg-gray-100 p-2 rounded">
                    <strong>Q:</strong> {conv.question}<br />
                    <strong>A:</strong> {conv.answer}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {trainingMode === 'random' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="relative">
              <Textarea
                ref={textareaRef}
                value={randomText}
                onChange={(e) => setRandomText(e.target.value)}
                minRows= {4}
                placeholder="Paste your text here"
                className={`w-full transition-all duration-300 ease-in-out ${showFullTextarea ? '' : 'max-h-[100px] overflow-hidden'}`}
              />
              {randomText.split('\n').length > 4 && (
                <Button 
                  variant="link" 
                  onClick={() => setShowFullTextarea(!showFullTextarea)}
                  className="absolute bottom-2 right-2 bg-white"
                >
                  {showFullTextarea ? (
                    <>
                      Show Less <ChevronUp className="ml-2" />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown className="ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="mt-2">
              <h4 className="text-lg font-semibold mb-2">Preview:</h4>
              {randomText.split('\n').length > 3 && (
                <Button 
                  variant="link" 
                  onClick={() => setShowFullText(!showFullText)}
                  className="flex items-center"
                >
                  {showFullText ? 'Show Less' : 'Show More'}
                  {showFullText ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
                </Button>
              )}
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto max-h-[200px] overflow-y-auto">
                {showFullText ? randomText : (
                  <>
                    {randomText.split('\n').slice(0, 3).join('\n')}
                    {randomText.split('\n').length > 3 && '...'}
                  </>
                )}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {trainingMode && (
        <div className="mt-4">
          <Button 
            onClick={handleTrain} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {loading ? 'Training in Progress...' : 'Train Chatbot'}
          </Button>
        </div>
      )}

      {loading && (
        <div className="mt-4 space-y-2">
          <Progress value={trainingProgress} className="w-full" />
          <p className="text-sm text-gray-500 text-center">
            Training in progress: {trainingProgress.toFixed(0)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default TextTrainSession;
