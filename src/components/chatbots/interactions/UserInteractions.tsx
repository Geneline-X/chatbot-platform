"use client"
import React, { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User, Bot, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@prisma/client';
import InteractionDetail from './InteractionDetail';

interface UserInteractionsProps {
  messages: (Message & { createAt: Date })[];
  onClose: () => void;
  onLikeMessage: (messageId: string, liked: boolean) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const UserInteractions: React.FC<UserInteractionsProps> = ({
  messages,
  onClose,
  onLikeMessage,
  onLoadMore,
  hasMore,
  isLoading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const removeMarkdown = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              message.isUserMessage ? 'bg-blue-50 hover:bg-blue-100' : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => setSelectedMessage(message)}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {message.isUserMessage ? (
                  <User className="h-6 w-6 text-blue-500" />
                ) : (
                  <Bot className="h-6 w-6 text-gray-500" />
                )}
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {removeMarkdown(message.text.length > 100 ? message.text.substring(0, 100) + '...' : message.text)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(message.createAt, { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {hasMore && (
        <div className="p-4 border-t">
          <Button onClick={onLoadMore} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className='w-4 h-4 animate-spin'/> : 'Load More'}
          </Button>
        </div>
      )}
      {selectedMessage && (
        <InteractionDetail
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onLikeMessage={onLikeMessage}
        />
      )}
    </div>
  );
};

export default UserInteractions;