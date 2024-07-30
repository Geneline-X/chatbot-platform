"use client";

import React from 'react';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Send } from 'lucide-react';

interface ChatInputStandaloneProps {
    message: string;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    addMessage: (text: string | undefined) => void;
    theme: any;
}

const ChatInputStandalone: React.FC<ChatInputStandaloneProps> = ({ message, handleInputChange, addMessage, theme }) => {
    return (
        <div className={`flex p-4 border-t ${theme.backgroundColor}`}>
          <Textarea
            placeholder="Type a message..."
            value={message}
            onChange={handleInputChange}
            className={`flex-1 mr-4 bg-transparent ${theme.fontColor} border ${theme.primaryColor}`}
          />
          <Button onClick={() => addMessage(message)} className={`${theme.primaryColor}`}>
            <Send />
          </Button>
        </div>
      );
}

export default ChatInputStandalone



