import React from 'react'
import Image from 'next/image'

const ChatbotPreview = ({ formData }:any) => {
  const { theme, widget, logo } = formData

  return (
    <div className="border rounded-lg p-4 h-[600px] flex flex-col" style={{ backgroundColor: theme.backgroundColor }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: theme.primaryColor }}>Chatbot Preview</h3>
        {logo && (
          <Image src={logo} alt="Chatbot Logo" width={40} height={40} className="rounded-full" />
        )}
      </div>
      <div className="flex-grow overflow-y-auto mb-4">
        <div className="flex flex-col space-y-2">
          <div className="self-start bg-white rounded-lg p-2 max-w-[70%]" style={{ backgroundColor: theme.chatBubbleBotColor, color: theme.secondaryColor }}>
            {widget.welcomeMessage}
          </div>
          <div className="self-end bg-gray-200 rounded-lg p-2 max-w-[70%]" style={{ backgroundColor: theme.chatBubbleUserColor, color: theme.primaryColor }}>
            Hello! I have a question.
          </div>
          <div className="self-start bg-white rounded-lg p-2 max-w-[70%]" style={{ backgroundColor: theme.chatBubbleBotColor, color: theme.secondaryColor }}>
            Sure, I&apos;d be happy to help! What&apos;s your question?
          </div>
        </div>
      </div>
      <div className="flex">
        <input 
          type="text" 
          placeholder="Type your message..." 
          className="flex-grow p-2 rounded-l-lg border" 
          style={{ backgroundColor: theme.secondaryColor, color: theme.primaryColor }}
        />
        <button 
          className="px-4 py-2 rounded-r-lg" 
          style={{ backgroundColor: theme.primaryColor, color: theme.secondaryColor }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatbotPreview