"use client";

import React, { useContext } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { ChatContex } from './ChatContext'
import { isValidEmail } from '@/lib/utils';

interface ChatInputProps {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    chatBubbleUserColor: string;
    chatBubbleBotColor: string;
    backgroundColor: string;
    font: string;
    fontSize: string;
    fontColor?: string; // Adding fontColor to the theme
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
    style={{ padding: '10px', backgroundColor: theme.backgroundColor, borderTop: '1px solid #E0E0E0', marginTop: 3 }}
    className='flex justify-center bg-black'
    >
      <div className="flex items-center w-full max-w-3xl space-x-2 lg:w-1/2">
        <Textarea
          placeholder='Type a message...'
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} 
          style={{ 
            backgroundColor: 'transparent', 
            color: theme.fontColor || '#000', 
            border: `1px solid ${theme.primaryColor}` 
          }}
          className="flex-1 resize-none p-2"
          rows={1}
          disabled={!isValidEmail(email) || isLoading}
        />
        <Button onClick={() => addMessage()} style={{ backgroundColor: theme.primaryColor }} disabled={isLoading}>
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
