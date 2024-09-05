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
import { MyLoader } from '../MyLoader';

interface ConfigurableChatbotProps {
  chatbotId: string;
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

const ConfigurableChatbot: React.FC<ConfigurableChatbotProps> = ({ chatbotId }) => {
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
      console.log("this is the theme config: ", themeConfig)
      //@ts-ignore
      setOtherProps(themeConfig)
    }
  }, [config]);

  if (configLoading) return <div className='flex justify-center text-center'><MyLoader/></div>;
  if (configError) return <div>Error loading chatbot configuration</div>;

  const chatContainerStyle: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
    fontFamily: theme.font,
    fontSize: theme.fontSize,
    width: '100%',
    height: '100%',
    border: `1px solid ${theme.primaryColor}`,
    borderRadius: '10px',
    overflow: 'hidden',
  };

 
  return (
    <div style={chatContainerStyle}>
      <ChatContextProvider chatbotId={chatbotId}>
        <ChatHeader avatar={config?.logo} theme={theme} welcomeMessage={config?.name!} key={config?.id}/>
        <Messages chatbotId={chatbotId} theme={theme} welcomeMessage={otherProps.widget.welcomeMessage}/>
        <ChatInput  theme={theme} />
      </ChatContextProvider>
    </div>
  );
};

export default ConfigurableChatbot;
