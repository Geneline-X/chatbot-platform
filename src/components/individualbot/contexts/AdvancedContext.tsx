"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Advanced {
  customCSS: string;
  chatHistory: string;
  gdprCompliance: string;
}

const AdvancedContext = createContext<Advanced | undefined>(undefined);

export const AdvancedProvider = ({ children }: { children: ReactNode }) => {
  const [advanced, setAdvanced] = useState<Advanced>({
    customCSS: '',
    chatHistory: 'enabled',
    gdprCompliance: 'enabled'
  });

  return (
    <AdvancedContext.Provider value={advanced}>
      {children}
    </AdvancedContext.Provider>
  );
};

export const useAdvanced = () => useContext(AdvancedContext);
