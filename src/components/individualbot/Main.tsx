"use client"

import React, { useState, useEffect } from 'react'
import ChatHeader from './ChatHeader'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import { ChatContextProvider } from './ChatContext'

const MainChatbot = () => {

  const [isOpen, setIsOpen] = useState(false)

  const [theme, setTheme] = useState({
    primaryColor: '#007BFF',
    secondaryColor: '#FFFFFF',
    chatBubbleUserColor: '#E0E0E0',
    chatBubbleBotColor: '#007BFF',
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
    overflow: 'hidden',
    display: isOpen ? 'block' : 'none',
    zIndex: 1000,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  }

  const widgetButtonStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: theme.primaryColor,
    color: theme.secondaryColor,
    display: isOpen ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 1000,
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  }

  return (
    <ChatContextProvider theme={theme} widget={widget} behavior={behavior} advanced={advanced}>
      <div style={widgetButtonStyle} onClick={() => setIsOpen(true)}>
        Chat
      </div>
      <div style={chatContainerStyle}>
         { isOpen &&
          <>
            <ChatHeader avatar={widget.botAvatar} welcomeMessage={widget.welcomeMessage} setIsOpen={setIsOpen}/>
            <div className='relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2'>
                <div className='flex-1 justify-between flex flex-col mb-28'>
                  <ChatMessages />
                </div>
                <div className='mt-8'>
                <ChatInput isTypingIndicatorVisible={behavior.showTypingIndicator} />
                </div>
          </div>
          </>}
      </div>
    </ChatContextProvider>
  )
}

export default MainChatbot
