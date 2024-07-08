"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Behavior {
  showTypingIndicator: boolean;
  messageDelay: number;
  autoRespondingHours: string;
  offlineMessage: string;
}

const BehaviorContext = createContext<Behavior | undefined>(undefined);

export const BehaviorProvider = ({ children }: { children: ReactNode }) => {
  const [behavior, setBehavior] = useState<Behavior>({
    showTypingIndicator: true,
    messageDelay: 1000,
    autoRespondingHours: '9am-5pm',
    offlineMessage: 'We are currently offline. Please leave a message.'
  });

  return (
    <BehaviorContext.Provider value={behavior}>
      {children}
    </BehaviorContext.Provider>
  );
};

export const useBehavior = () => useContext(BehaviorContext);
