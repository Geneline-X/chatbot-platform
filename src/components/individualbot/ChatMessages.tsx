"use client";

import React from 'react';
import ChatMessage from './ChatMessage';
import { Loader2 } from 'lucide-react';

interface ChatMessagesProps {
  messages: any[];
  theme: any;
  isLoading: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, theme, isLoading }) => {
  const messageContainerStyle: React.CSSProperties = {
    padding: '10px',
    height: '300px',
    overflowY: 'auto',
    backgroundColor: theme.secondaryColor,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  };

  return (
    <div style={messageContainerStyle}>
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          text={msg.text}
          isUser={msg.isUserMessage}
          theme={theme}
          isLoading={false} // Ensure individual messages are not set to loading
        />
      ))}
      {isLoading && (
        <ChatMessage
          key="loading"
          text={(
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              <span>Thinking...</span>
            </div>
          )}
          isUser={false}
          theme={theme}
          isLoading={true} // Set loading state for the loader message
        />
      )}
    </div>
  );
};

export default ChatMessages;
