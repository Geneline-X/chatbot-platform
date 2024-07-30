"use client"
import React from 'react'
import { X } from "lucide-react"

interface ChatHeaderStandaloneProps {
    avatar: string | undefined | null;
    welcomeMessage: string;
    theme: any;
    setIsOpen?: (isOpen: boolean) => void;
}

const ChatHeaderStandalone: React.FC<ChatHeaderStandaloneProps> = ({ avatar, welcomeMessage, theme, setIsOpen }) => {
    return (
        <div className={`flex items-center justify-between p-4 ${theme.primaryColor}`}>
          <div className="flex items-center">
            {avatar && <img src={avatar} alt="Bot Avatar" className="w-10 h-10 rounded-full" />}
            <h2 className={`ml-4 ${theme.secondaryColor}`}>{welcomeMessage}</h2>
          </div>
          <button
            onClick={() => setIsOpen && setIsOpen(false)}
            className="text-white text-xl focus:outline-none"
            aria-label="Close chat"
          >
            <X />
          </button>
        </div>
      );
}

export default ChatHeaderStandalone
