"use client"
import React, { useState } from 'react'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import { ChatContextProvider } from './ChatContext'

const MainChatbot = () => {
  const [theme, setTheme] = useState({
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
    chatBubbleUserColor: '#E0E0E0',
    chatBubbleBotColor: '#000000',
    backgroundColor: '#F0F0F0',
    font: 'Arial',
    fontSize: '14px'
  })

  const [widget, setWidget] = useState({
    position: 'bottom-right',
    size: 'medium',
    welcomeMessage: 'Hi! How can I help you today?',
    botAvatar: ''
  })

  const [behavior, setBehavior] = useState({
    showTypingIndicator: true,
    messageDelay: 1000,
    autoRespondingHours: '9am-5pm',
    offlineMessage: 'We are currently offline. Please leave a message.'
  })

  const [advanced, setAdvanced] = useState({
    customCSS: '',
    chatHistory: 'enabled',
    gdprCompliance: 'enabled'
  })

  const chatContainerStyle: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
    fontFamily: theme.font,
    fontSize: theme.fontSize,
    position: 'fixed',
    bottom: widget.position.includes('bottom') ? '20px' : 'unset',
    top: widget.position.includes('top') ? '20px' : 'unset',
    right: widget.position.includes('right') ? '20px' : 'unset',
    left: widget.position.includes('left') ? '20px' : 'unset',
    width: widget.size === 'small' ? '300px' : widget.size === 'large' ? '600px' : '400px',
    border: `1px solid ${theme.primaryColor}`,
    borderRadius: '10px',
    overflow: 'hidden'
  }

  return (
    <ChatContextProvider theme={theme} widget={widget} behavior={behavior} advanced={advanced}>
      <div style={chatContainerStyle}>
        <ChatHeader avatar={widget.botAvatar} welcomeMessage={widget.welcomeMessage} />
        <ChatMessages />
        <ChatInput isTypingIndicatorVisible={behavior.showTypingIndicator} />
      </div>
    </ChatContextProvider>
  )
}

export default MainChatbot
