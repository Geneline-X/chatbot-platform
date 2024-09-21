"use client"
import React from 'react'
import Image from 'next/image'
import ChatHeader from '../individualbot/ChatHeader'

const colorThemes = {
  'Classic Blue': { primary: '#007BFF', secondary: '#FFFFFF', user: '#E0E0E0', bot: '#007BFF', background: '#F0F0F0' },
  'Emerald Green': { primary: '#2ecc71', secondary: '#FFFFFF', user: '#E0E0E0', bot: '#2ecc71', background: '#F0F0F0' },
  'Ruby Red': { primary: '#e74c3c', secondary: '#FFFFFF', user: '#E0E0E0', bot: '#e74c3c', background: '#F0F0F0' },
  'Midnight Purple': { primary: '#9b59b6', secondary: '#FFFFFF', user: '#E0E0E0', bot: '#9b59b6', background: '#F0F0F0' },
  'Sunset Orange': { primary: '#e67e22', secondary: '#FFFFFF', user: '#E0E0E0', bot: '#e67e22', background: '#F0F0F0' },
}

const ChatbotPreview = ({ formData }: any) => {
  const { logo, theme } = formData
  const { theme: themeStyles, widget } = theme || {}

  // Get the selected color theme or default to Classic Blue
  const selectedTheme = colorThemes[themeStyles?.colorTheme as keyof typeof colorThemes] || colorThemes['Classic Blue']

  const headerTheme = {
    primaryColor: selectedTheme.primary,
    secondaryColor: selectedTheme.secondary,
    font: themeStyles?.font,
    fontSize: themeStyles?.fontSize,
  }

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col" style={{ height: '600px', width: '350px' }}>
      {/* Chat Header */}
      <ChatHeader
        avatar={logo}
        welcomeMessage={widget?.welcomeMessage || "Chat with us"}
        theme={headerTheme}
      />

      {/* Chat area */}
      <div className="flex-grow overflow-y-auto p-4" style={{ backgroundColor: selectedTheme.background }}>
        <div className="flex flex-col space-y-2">
          <div className="self-start bg-white rounded-lg p-2 max-w-[70%]" style={{ backgroundColor: selectedTheme.bot, color: selectedTheme.secondary }}>
            {widget?.welcomeMessage || "Welcome! How can I assist you today?"}
          </div>
          <div className="self-end bg-gray-200 rounded-lg p-2 max-w-[70%]" style={{ backgroundColor: selectedTheme.user, color: selectedTheme.primary }}>
            Hello! I have a question.
          </div>
          <div className="self-start bg-white rounded-lg p-2 max-w-[70%]" style={{ backgroundColor: selectedTheme.bot, color: selectedTheme.secondary }}>
            Sure, I&apos;d be happy to help! What&apos;s your question?
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="p-3 flex" style={{ backgroundColor: selectedTheme.background }}>
        <input 
          type="text" 
          placeholder="Type your message..." 
          className="flex-grow p-2 rounded-l-lg border" 
          style={{ backgroundColor: selectedTheme.secondary, color: selectedTheme.primary }}
        />
        <button 
          className="px-4 py-2 rounded-r-lg" 
          style={{ backgroundColor: selectedTheme.primary, color: selectedTheme.secondary }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatbotPreview