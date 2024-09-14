"use client";

import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import useChatbotConfig from '@/lib/hooks/useChatbotConfig';
import { Prisma } from '@prisma/client';
import { ChatContextProvider } from './ChatContext';
import Messages from './Messages';
import { MyLoader } from '../MyLoader';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

interface ConfigurableChatbotProps {
  chatbotId: string;
}

const defaultTheme = {
  primaryColor: '#007BFF',
  secondaryColor: '#FFFFFF',
  chatBubbleUserColor: '#E0E0E0',
  chatBubbleBotColor: '#007BFF',
  backgroundColor: '#F0F0F0',
  font: 'Inter, sans-serif',
  fontSize: '14px',
};

const ConfigurableChatbot: React.FC<ConfigurableChatbotProps> = ({ chatbotId }) => {
  const router = useRouter();
  const { config, isLoading: configLoading, error: configError } = useChatbotConfig(chatbotId);
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
      setOtherProps(themeConfig as any);
    }
  }, [config]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f0f2f5',
  };

  const chatContainerStyle: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
    fontFamily: theme.font,
    fontSize: theme.fontSize,
    width: '100%',
    maxWidth: '800px',
    height: '80vh',
    maxHeight: '800px',
    border: `1px solid ${theme.primaryColor}20`,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
  };

  if (configLoading) return (
    <div style={containerStyle}>
      <MyLoader />
    </div>
  );
  
  const handleBack = () => {
    router.push(`/chatbot-dashboard/chatbots`);
  };

  if (configError) return (
    <div style={containerStyle} className='text-red-500'>
      Error loading chatbot configuration
    </div>
  );

  return (
    <div style={containerStyle}>
      <Button onClick={handleBack} variant="ghost" className="self-start mb-4">
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Chatbot Details
      </Button>
      <div style={chatContainerStyle}>
        <ChatContextProvider chatbotId={chatbotId}>
          <ChatHeader 
            avatar={config?.logo} 
            theme={theme} 
            welcomeMessage={config?.name || 'Welcome'} 
            key={config?.id}
          />
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            <Messages 
              chatbotId={chatbotId} 
              theme={theme} 
              welcomeMessage={otherProps?.widget?.welcomeMessage || ""}
            />
          </div>
          <ChatInput theme={theme} />
        </ChatContextProvider>
      </div>
    </div>
  );
};

export default ConfigurableChatbot;
