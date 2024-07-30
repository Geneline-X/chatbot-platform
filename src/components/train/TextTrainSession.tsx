"use client";

import React, { useState } from 'react';
import { useChatbot } from '../business/BusinessContext';
import { toast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

const TextTrainSession: React.FC = () => {
  const [trainingMode, setTrainingMode] = useState<'guided' | 'random' | null>(null);
  const [guidedConversations, setGuidedConversations] = useState<{ question: string, answer: string }[]>([]);
  const [randomText, setRandomText] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
 
  const { currentChatbot } = useChatbot()

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
    try {
      let response;
      if (trainingMode === 'guided') {
        response = await fetch("http://localhost:3800/chatbot-upload/text", {
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
        if (response.ok) {
          toast({ title: "Conversations added" });
        }
      } else if (trainingMode === 'random') {
        response = await fetch("http://localhost:3800/chatbot-upload/text", {
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
        if (response.ok) {
          toast({ title: "Data added"});
        }
      }
      if (!response?.ok) {
        toast({ title: "Error training chatbot", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error training chatbot", variant: "destructive" });
      console.error('Error training chatbot:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50">
      <h2 className="text-xl mb-4">Train Chatbot</h2>
      
      <div className="mb-4">
        <button onClick={() => setTrainingMode('guided')} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
          Guided Conversation
        </button>
        <button onClick={() => setTrainingMode('random')} className="px-4 py-2 bg-green-500 text-white rounded">
          Random Text
        </button>
      </div>

      {trainingMode === 'guided' && (
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg mb-2">Guided Conversation</h3>
          <div className="mb-2">
            <Input
              type="text"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="Enter question"
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-2">
            <Input
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Enter answer"
              className="p-2 border border-gray-300 rounded w-full"
            />
          </div>
          <button onClick={handleAddGuidedConversation} className="px-4 py-2 bg-blue-500 text-white rounded">
            Add Conversation
          </button>

          <div className="mt-4">
            <h4 className="text-md">Conversations:</h4>
            <ul className="list-disc pl-5">
              {guidedConversations.map((conv, index) => (
                <li key={index} className="mb-1">{conv.question}: {conv.answer}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {trainingMode === 'random' && (
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-lg mb-2">Random Text Input</h3>
          <Textarea
            value={randomText}
            onChange={(e) => setRandomText(e.target.value)}
            placeholder="Paste your text here"
            className="p-2 border border-gray-300 rounded w-full h-32"
            minRows={4}
          />
        </div>
      )}

      {trainingMode && (
        <div className="mt-4">
          <button 
          onClick={handleTrain} 
          className="px-4 py-2 bg-purple-500 text-white rounded"
          disabled={loading}
          >
            {loading ? <Loader2 className='h-4 w-4 animate-spin'/> : 'Train Chatbot'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TextTrainSession;
