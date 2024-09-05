"use client";

import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import useChatbotConfig from '@/lib/hooks/useChatbotConfig';
import { Prisma } from '@prisma/client';
import { trpc } from '@/app/_trpc/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '../ui/use-toast';
import { ChatContextProvider } from './ChatContext';
import Messages from './Messages';

interface StandaloneChatbotProps {
  chatbotId:string
}

const defaultTheme = {
    primaryColor: '#007BFF',
    secondaryColor: '#FFFFFF',
    chatBubbleUserColor: '#E0E0E0',
    chatBubbleBotColor: '#007BFF',
    backgroundColor: '#F0F0F0',
    font: 'Arial',
    fontSize: '14px',
};

const StandaloneChatbot: React.FC<StandaloneChatbotProps> = ({
  chatbotId
}) => {

  const { config, isLoading: configLoading, error: configError } = useChatbotConfig(chatbotId);
  const queryClient = useQueryClient();

  const [theme, setTheme] = useState(defaultTheme);
  const [otherProps, setOtherProps] = useState({
    widget: {welcomeMessage: ''},
  });

  useEffect(() => {
    //@ts-ignore
    if (config?.theme) {
      const themeConfig = config.theme as Prisma.JsonObject;
      setTheme(themeConfig?.theme as typeof defaultTheme || defaultTheme);
      //@ts-ignore
      setOtherProps(themeConfig)
      
    }
  }, [config]);

  if (configLoading) return <div className="flex justify-center items-center h-screen text-xl text-gray-500">Loading...</div>;
  if (configError) return <div className="flex justify-center items-center h-screen text-xl text-gray-500">Error loading chatbot configuration</div>;


  const chatContainerStyle: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
    fontFamily: theme.font,
    fontSize: theme.fontSize,
  };
 
  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-50">
      <ChatHeader avatar={config?.logo} theme={theme} welcomeMessage={config?.name!} key={config?.id} />
  
      <ChatContextProvider chatbotId={chatbotId}>
        
          <Messages chatbotId={chatbotId} theme={theme} welcomeMessage={otherProps.widget.welcomeMessage}/>
          <ChatInput theme={theme} />
        
      </ChatContextProvider>
    </div>
  );
};

export default StandaloneChatbot;
