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
import { Loader2 } from "lucide-react";
import { MyLoader } from "../MyLoader";

const ChatbotDetails = ({ chatbot, onBack }: ChatbotDetailsProps) => {
  const router = useRouter();
  const { currentChatbot, setCurrentChatbot } = useChatbot();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [messagesData, setMessagesData] = useState<{ frequentlyAskedQuestions: string[], sentimentAnalysis: Record<string, number> } | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchMessagesData = async () => {
      if (isFetchingRef.current) return; // Prevent multiple fetches

      try {
        isFetchingRef.current = true;
        setIsLoadingMessages(true);

        const response = await fetch(`/api/getmessagesanalysis`, {
          method: 'POST',
          body: JSON.stringify({ chatbotId: chatbot.id}),
        });
        const data = await response.json();
        
        console.log(data.analysis);
        setMessagesData(data.analysis);
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Failed to retrieve analysis data.",
          variant: "destructive",
        });
        console.error(error);
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
      title: `Chatbot "${currentChatbot?.name}" selected for customization`,
      description: "Redirecting to the design page...",
    });
    router.push("/chatbot-dashboard/design");
  };

  const handleTrainClick = () => {
    setCurrentChatbot(chatbot);
    toast({
      title: `Chatbot "${currentChatbot?.name}" selected for training`,
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={onBack}>
          ← Back to Chatbots List
        </Button>
        <div className="flex items-center space-x-4">
          <Button onClick={handleChatbotExport}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Export"}
          </Button>
          <Link href={`/chatbot-dashboard/chatbots/${chatbot.id}`}>
            <Button variant="secondary">Test Your Bot</Button>
          </Link>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{chatbot.name}</h1>
        <p className="text-gray-600">{chatbot.systemInstruction}</p>
      </div>

      <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Message Analysis</h2>
          {isLoadingMessages ? (
            <MyLoader /> 
          ) : (
            <MessagesList messagesData={messagesData} />
          )}
      </div>

        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Custom Configurations</h2>
          <Configurations configurations={chatbot.customConfigurations} />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline" onClick={handleCustomizeClick}>
          Customize Design
        </Button>
        <Button variant="outline" onClick={handleTrainClick}>
          Train Chatbot
        </Button>
      </div>

      <ExportChatbotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        embedCode={embedCode}
      />
    </div>
  );
};

export default ChatbotDetails;
