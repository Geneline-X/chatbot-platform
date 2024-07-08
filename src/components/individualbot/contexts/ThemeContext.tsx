"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  chatBubbleUserColor: string;
  chatBubbleBotColor: string;
  backgroundColor: string;
  font: string;
  fontSize: string;
}

const ThemeContext = createContext<Theme | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>({
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    chatBubbleUserColor: '#E0E0E0',
    chatBubbleBotColor: '#007BFF',
    backgroundColor: '#F0F0F0',
    font: 'Arial',
    fontSize: '14px'
  });

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
