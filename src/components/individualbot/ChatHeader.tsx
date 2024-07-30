"use client";

import React from 'react';
import { X } from 'lucide-react';

interface ChatHeaderProps {
  avatar: string | undefined | null;
  welcomeMessage: string;
  setIsOpen?: (isOpen: boolean) => void;
  theme: any; // Added theme prop
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ avatar, welcomeMessage, theme }) => {
  return (
    <div style={{
      backgroundColor: theme.primaryColor,
      color: theme.secondaryColor,
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/*  eslint-disable-next-line @next/next/no-img-element  */}
        {avatar && <img src={avatar} alt="Bot Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', marginRight: '15px' }} />}
        <h2 style={{
          margin: 0,
          fontFamily: theme.font,
          fontSize: theme.fontSize,
          fontWeight: 'bold'
        }}>{welcomeMessage}</h2>
      </div>
      
    </div>
  );
};

export default ChatHeader;
