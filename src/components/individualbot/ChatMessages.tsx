"use client"
import React, { useContext } from 'react'
import { ChatContext } from './ChatContext'

const ChatMessages = () => {
  const { messages, theme } = useContext(ChatContext)

  return (
    <div className="chat-messages" style={{ padding: '10px', height: '300px', overflowY: 'auto' }}>
      {messages.map((msg, index) => (
        <div key={index} style={{ margin: '10px 0', display: 'flex', justifyContent: msg.isUser ? 'flex-end' : 'flex-start' }}>
          <div style={{ backgroundColor: msg.isUser ? theme.chatBubbleUserColor : theme.chatBubbleBotColor, padding: '10px', borderRadius: '10px', color: '#FFFFFF' }}>
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatMessages
