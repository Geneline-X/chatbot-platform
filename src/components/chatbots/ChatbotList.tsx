"use client"
import React from 'react'

interface Props {
    onSelect: (chatbot: ChatbotProps) => void
}
type ChatbotProps = {
    id: string
    name:string,
    description: string
}
const ChatbotsList = ({ onSelect }: Props) => {
  const chatbots: ChatbotProps[] = [
    // Fetch chatbots from API or state
  ]

  return (
    <div>
      {chatbots.map((chatbot) => (
        <div
          key={chatbot.id}
          className="p-4 bg-white shadow rounded mb-4 cursor-pointer"
          onClick={() => onSelect(chatbot)}
        >
          <h2 className="text-xl font-semibold">{chatbot.name}</h2>
          <p>{chatbot.description}</p>
        </div>
      ))}
    </div>
  )
}

export default ChatbotsList
