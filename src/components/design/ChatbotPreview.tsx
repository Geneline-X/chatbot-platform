import React from 'react'
import Image from 'next/image'
import ChatHeader from '../individualbot/ChatHeader'

const ChatbotPreview = ({ formData }:any) => {
  const { logo, theme } = formData
  const { theme: themeStyles, widget } = theme || {}

  const headerTheme = {
    primaryColor: themeStyles?.primaryColor,
    secondaryColor: themeStyles?.secondaryColor,
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
      <div className="flex-grow overflow-y-auto p-4" style={{ backgroundColor: themeStyles?.backgroundColor }}>
        <div className="flex flex-col space-y-2">
          <div className="self-start bg-white rounded-lg p-2 max-w-[70%]" style={{ backgroundColor: themeStyles?.chatBubbleBotColor, color: themeStyles?.secondaryColor }}>
            {widget?.welcomeMessage || "Welcome! How can I assist you today?"}
          </div>
          <div className="self-end bg-gray-200 rounded-lg p-2 max-w-[70%]" style={{ backgroundColor: themeStyles?.chatBubbleUserColor, color: themeStyles?.primaryColor }}>
            Hello! I have a question.
          </div>
          <div className="self-start bg-white rounded-lg p-2 max-w-[70%]" style={{ backgroundColor: themeStyles?.chatBubbleBotColor, color: themeStyles?.secondaryColor }}>
            Sure, I&apos;d be happy to help! What&apos;s your question?
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="p-3 flex" style={{ backgroundColor: themeStyles?.backgroundColor }}>
        <input 
          type="text" 
          placeholder="Type your message..." 
          className="flex-grow p-2 rounded-l-lg border" 
          style={{ backgroundColor: themeStyles?.secondaryColor, color: themeStyles?.primaryColor }}
        />
        <button 
          className="px-4 py-2 rounded-r-lg" 
          style={{ backgroundColor: themeStyles?.primaryColor, color: themeStyles?.secondaryColor }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatbotPreview