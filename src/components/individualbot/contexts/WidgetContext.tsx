"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Widget {
  position: string;
  size: string;
  welcomeMessage: string;
  botAvatar: string;
}

const WidgetContext = createContext<Widget | undefined>(undefined);

export const WidgetProvider = ({ children }: { children: ReactNode }) => {
  const [widget, setWidget] = useState<Widget>({
    position: 'bottom-right',
    size: 'medium',
    welcomeMessage: 'Hi! How can I help you today?',
    botAvatar: ''
  });

  return (
    <WidgetContext.Provider value={widget}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidget = () => useContext(WidgetContext);
