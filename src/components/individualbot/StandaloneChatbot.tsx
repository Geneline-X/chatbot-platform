"use client";

import React, { useEffect, useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import useChatbotConfig from '@/lib/hooks/useChatbotConfig';
import { Prisma } from '@prisma/client';
import { ChatContextProvider } from './ChatContext';
import Messages from './Messages';
import { MyLoader } from '../MyLoader';
import { motion, AnimatePresence } from 'framer-motion';
interface StandaloneChatbotProps {
  chatbotId: string;
}

const defaultTheme = {
  primaryColor: '#007BFF',
  secondaryColor: '#FFFFFF',
  chatBubbleUserColor: '#E0E0E0',
  chatBubbleBotColor: '#007BFF',
  backgroundColor: '#F0F0F0',
  font: 'Inter, sans-serif',
  fontSize: '16px',
};

const StandaloneChatbot: React.FC<StandaloneChatbotProps> = ({ chatbotId }) => {
  const { config, isLoading: configLoading, error: configError } = useChatbotConfig(chatbotId);
  const [theme, setTheme] = useState(defaultTheme);
  const [otherProps, setOtherProps] = useState({
    widget: { welcomeMessage: '' },
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
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    backgroundColor: theme.backgroundColor,
    fontFamily: theme.font,
    fontSize: theme.fontSize,
    color: theme.primaryColor,
    overflow: 'hidden',
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const renderContent = () => {
    if (configLoading) {
      return (
        <div className="flex-1 flex justify-center items-center flex-col">
          <MyLoader />
          <p className="mt-4 text-lg">Loading chatbot...</p>
        </div>
      );
    }

    if (configError) {
      return (
        <div className="flex-1 flex justify-center items-center text-red-500 text-xl">
          Error loading chatbot configuration
        </div>
      );
    }

    return (
      <>
        <ChatHeader
          avatar={config?.logo}
          theme={theme}
          welcomeMessage={config?.name || 'Welcome'}
          key={config?.id}
        />
        <div style={contentStyle}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Messages
              chatbotId={chatbotId}
              theme={theme}
              welcomeMessage={otherProps.widget.welcomeMessage || "Welcome"}
            />
          </div>
          <ChatInput theme={theme} />
        </div>
      </>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={containerStyle}
      >
        <ChatContextProvider chatbotId={chatbotId}>
          {renderContent()}
        </ChatContextProvider>
      </motion.div>
    </AnimatePresence>
  );
};

export default StandaloneChatbot;
