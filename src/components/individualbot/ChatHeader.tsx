"use client"
import React, { useContext } from 'react'
import { ChatContext } from './ChatContext'

interface ChatHeaderProps {
  avatar: string
  welcomeMessage: string
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ avatar, welcomeMessage }) => {
  const { theme } = useContext(ChatContext)

  return (
    <div className="chat-header" style={{ backgroundColor: theme.primaryColor, color: theme.secondaryColor, padding: '10px' }}>
      <img src={avatar} alt="Bot Avatar" style={{ width: '40px', borderRadius: '50%' }} />
      <h2 style={{ marginLeft: '10px' }}>{welcomeMessage}</h2>
    </div>
  )
}

export default ChatHeader
