"use client"
// BusinessContext.tsx

import React, { ReactNode, createContext, useState, useContext, useEffect } from 'react';
import { trpc } from '@/app/_trpc/client';
import { Business, ChatbotProps } from './types';

interface BusinessContextType {
  currentBusiness: Business | null;
  setCurrentBusiness: (business: Business) => void;
  businesses: Business[] | null;
  isLoading: boolean;
}

interface ChatbotContextType {
  currentChatbot: ChatbotProps | null;
  setCurrentChatbot: (chatbot: ChatbotProps) => void;
}

const BusinessContext = createContext<BusinessContextType | null>(null);
const ChatbotContext = createContext<ChatbotContextType | null>(null);

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface BusinessProviderProps {
  children: ReactNode;
}

export const BusinessProvider: React.FC<BusinessProviderProps> = ({ children }) => {
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const { data: businesses, isLoading } = trpc.getAllBusinesses.useQuery();

  useEffect(() => {
    if (businesses && businesses.length > 0 && !currentBusiness) {
      setCurrentBusiness(businesses[0]);
    }
  }, [businesses, currentBusiness]);

  return (
    //@
    <BusinessContext.Provider value={{ currentBusiness, setCurrentBusiness, businesses: businesses ?? null, isLoading }}>
      <ChatbotProvider>
        {children}
      </ChatbotProvider>
    </BusinessContext.Provider>
  );
};

interface ChatbotProviderProps {
    children: ReactNode;
  }
export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [currentChatbot, setCurrentChatbot] = useState<ChatbotProps | null>(null);

  return (
    <ChatbotContext.Provider value={{ currentChatbot, setCurrentChatbot }}>
      {children}
    </ChatbotContext.Provider>
  );
};
