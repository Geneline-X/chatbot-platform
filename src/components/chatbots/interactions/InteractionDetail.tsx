"use client"
import React, { useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User, Bot, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@prisma/client';

interface InteractionDetailProps {
  message: Message & { createAt: Date };
  onClose: () => void;
  onLikeMessage: (messageId: string, liked: boolean) => void;
}

const InteractionDetail: React.FC<InteractionDetailProps> = ({ message, onClose, onLikeMessage }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const removeMarkdown = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {message.isUserMessage ? 'User Message' : 'Chatbot Response'}
          </h3>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="flex items-start space-x-4 mb-4">
            <div className="flex-shrink-0">
              {message.isUserMessage ? (
                <User className="h-8 w-8 text-blue-500" />
              ) : (
                <Bot className="h-8 w-8 text-gray-500" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">
                {formatDistanceToNow(message.createAt, { addSuffix: true })}
              </p>
              <p className="text-base text-gray-700 whitespace-pre-wrap">{removeMarkdown(message.text)}</p>
            </div>
          </div>
          {/* {!message.isUserMessage && (
            <div className="flex space-x-2 mt-6">
              <Button
                size="sm"
                variant={'ghost'}
                onClick={() => onLikeMessage(message.id, true)}
                className="flex items-center space-x-2 text-green-600 hover:bg-green-50"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Like</span>
              </Button>
              <Button
                size="sm"
                variant={'ghost'}
                onClick={() => onLikeMessage(message.id, false)}
                className="flex items-center space-x-2 text-red-600 hover:bg-red-50"
              >
                <ThumbsDown className="h-4 w-4" />
                <span>Dislike</span>
              </Button>
            </div>
          )} */}
        </div>
        <div className="flex justify-end p-4 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default InteractionDetail;