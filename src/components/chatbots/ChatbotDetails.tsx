"use client";
import React, { useEffect, useRef, useState } from "react";
import MessagesList from "../MessageList";
import FilesList from "../FilesList";
import Configurations from "../Configurations";
import { useChatbot } from "../business/BusinessContext";
import { ChatbotDetailsProps } from "@/types/mainTypes";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { toast } from "../ui/use-toast";
import Link from "next/link";
import ExportChatbotModal from "./ExportChatbotModal";
import { Loader2, Info, Settings, Brain } from "lucide-react";
import { MyLoader } from "../MyLoader";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const ChatbotDetails = ({ chatbot, onBack }: ChatbotDetailsProps) => {
  const router = useRouter();
  const { currentChatbot, setCurrentChatbot } = useChatbot();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [messagesData, setMessagesData] = useState<{ frequentlyAskedQuestions: string[], sentimentAnalysis: Record<string, number> } | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [hasError, setHasError] = useState(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchMessagesData = async () => {
      if (isFetchingRef.current) return; // Prevent multiple fetches

      try {
        isFetchingRef.current = true;
        setIsLoadingMessages(true);
        setHasError(false);

        const response = await fetch(`/api/getmessagesanalysis`, {
          method: 'POST',
          body: JSON.stringify({ chatbotId: chatbot.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages data');
        }

        const data = await response.json();
        
        setMessagesData(data.analysis);
      } catch (error) {
        console.error(error);
        setHasError(true);
        toast({
          title: "Error fetching data",
          description: "Failed to retrieve analysis data.",
          variant: "destructive",
        });
      } finally {
        isFetchingRef.current = false;
        setIsLoadingMessages(false);
      }
    };

    fetchMessagesData();
  }, [chatbot.id]);

  const handleCustomizeClick = () => {
    setCurrentChatbot(chatbot);
    toast({
      title: `Customizing "${chatbot.name}"`,
      description: "Redirecting to the design page...",
    });
    router.push("/chatbot-dashboard/design");
  };

  const handleTrainClick = () => {
    setCurrentChatbot(chatbot);
    toast({
      title: `Training "${chatbot.name}"`,
      description: "Redirecting to the training page...",
    });
    router.push("/chatbot-dashboard/train");
  };

  const handleChatbotExport = async () => {
    try {
      setLoading(true);
      toast({
        title: "Exporting Chatbot...",
        description: "Preparing your chatbot for public access.",
      });
      setEmbedCode(`${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/chatbot/${chatbot.id}`);
      setIsModalOpen(true);
    } catch (error) {
      toast({
        title: "Error exporting chatbot",
        description: "Something went wrong, please try again.",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const truncateInstruction = (instruction: string, maxLength: number = 100) => {
    if (instruction.length <= maxLength) return instruction;
    return instruction.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20">
            ← Back to Chatbots
          </Button>
          <div className="flex items-center space-x-4">
            <Button onClick={handleChatbotExport} className="bg-white text-blue-600 hover:bg-blue-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Export"}
            </Button>
            <Link href={`/chatbot-dashboard/chatbots/${chatbot.id}`}>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30">Test Your Bot</Button>
            </Link>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">{chatbot.name}</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-white/80 cursor-pointer">
                {truncateInstruction(chatbot.systemInstruction)}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-md">{chatbot.systemInstruction}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-100 p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <Info className="mr-2 h-5 w-5 text-blue-500" />
              Message Analysis
            </h2>
            {!isLoadingMessages && !hasError && messagesData && (
              <span className="text-sm text-gray-500">
                {messagesData.frequentlyAskedQuestions.length} FAQs | {Object.keys(messagesData.sentimentAnalysis).length} Sentiments
              </span>
            )}
          </div>
          <div className="p-4">
            {isLoadingMessages ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) :  messagesData && (messagesData.frequentlyAskedQuestions.length > 0 || Object.keys(messagesData.sentimentAnalysis).length > 0) ? (
              <MessagesList messagesData={messagesData} />
            ) : (
              <div className="text-center text-gray-500 py-8">
                No messages yet. Start interacting with your chatbot to see analysis here.
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gray-100 p-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Settings className="mr-2 h-5 w-5 text-blue-500" />
              Custom Configurations
            </h2>
          </div>
          <div className="p-4">
            <Configurations configurations={chatbot?.customConfigurations ?chatbot?.customConfigurations : <>No Configurations Set</>} />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={handleCustomizeClick} className="flex items-center">
          <Settings className="mr-2 h-4 w-4" /> Customize Design
        </Button>
        <Button variant="outline" onClick={handleTrainClick} className="flex items-center">
          <Brain className="mr-2 h-4 w-4" /> Train Chatbot
        </Button>
      </div>

      {isModalOpen && (
        <ExportChatbotModal
          onClose={() => setIsModalOpen(false)}
          embedCode={embedCode}
          chatbotId={chatbot.id}
        />
      )}
    </div>
  );
};

export default ChatbotDetails;
