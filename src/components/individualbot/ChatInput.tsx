"use client";

import React, { useContext } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { ChatContex } from './ChatContext';
import { isValidEmail } from '@/lib/utils';
import Link from 'next/link';

interface ChatInputProps {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    chatBubbleUserColor: string;
    chatBubbleBotColor: string;
    backgroundColor: string;
    font: string;
    fontSize: string;
    fontColor?: string;
  };
}

const ChatInput: React.FC<ChatInputProps> = ({ theme }) => {
  const { message, handleInputChange, addMessage, isLoading, email } = useContext(ChatContex);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addMessage();
    }
  };

  return (
    <div 
      style={{ 
        padding: '16px', 
        backgroundColor: theme.backgroundColor, 
        borderTop: `1px solid ${theme.primaryColor}20`, 
        marginTop: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {isValidEmail(email) ? (
        <div className="flex items-center w-full max-w-3xl space-x-2">
          <Textarea
            placeholder='Type a message...'
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} 
            style={{ 
              backgroundColor: 'transparent', 
              color: theme.fontColor || '#000', 
              border: `1px solid ${theme.primaryColor}`,
              width: '100%',
            }}
            className="flex-1 resize-none p-2"
            rows={1}
            disabled={!isValidEmail(email) || isLoading}
          />
          <Button onClick={() => addMessage()} style={{ backgroundColor: theme.primaryColor }} disabled={isLoading}>
            <Send />
          </Button>
        </div>
      ) : null}
      
      <div 
        style={{
          marginTop: '12px',
          padding: '6px 12px',
          borderRadius: '20px',
          backgroundColor: `${theme.primaryColor}10`,
          display: 'inline-block',
        }}
      >
        <p 
          style={{
            fontSize: '12px',
            color: theme.primaryColor,
            fontFamily: theme.font,
            fontWeight: 500,
          }}
        >
          Powered by{' '}
          <Link 
            href="https://geneline-x.net" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              fontWeight: 700,
              textDecoration: 'none',
              color: theme.primaryColor,
            }}
          >
            Geneline-X
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ChatInput;