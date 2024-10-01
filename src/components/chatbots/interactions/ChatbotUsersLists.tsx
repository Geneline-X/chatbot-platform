"use client"
import React from 'react';
import { ChatbotUser } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

interface ChatbotUsersListProps {
  users: ChatbotUser[];
  onSelectUser: (userId: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const ChatbotUsersList: React.FC<ChatbotUsersListProps> = ({ 
  users, 
  onSelectUser, 
  onLoadMore, 
  hasMore, 
  isLoading 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <ul className="divide-y divide-gray-200 max-h-[calc(100vh-300px)] overflow-y-auto">
        {users.map((user) => (
          <li
            key={user.id}
            className="px-6 py-4 cursor-pointer hover:bg-blue-50 transition duration-150 ease-in-out"
            onClick={() => onSelectUser(user.id)}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                <p className="text-sm text-gray-500 truncate">Last active: 2 hours ago</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          <Button 
            onClick={onLoadMore} 
            disabled={isLoading} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatbotUsersList;