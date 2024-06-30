"use client"
import React from 'react'
import MessagesList from "../MessageList"
import FilesList from "../FilesList"
import Configurations from "../Configurations"

import { ChatbotDetailsProps } from '@/types/mainTypes'

const ChatbotDetails = ({ chatbot, onBack }:ChatbotDetailsProps) => {
  return (
    <div>
      <button className="mb-4 p-2 bg-gray-500 text-white rounded" onClick={onBack}>
        Back to Chatbots List
      </button>
      <h1 className="text-2xl font-bold mb-4">{chatbot.name}</h1>
      <p>{chatbot.systemInstruction}</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Messages</h2>
      <MessagesList chatbotId={chatbot.id} />
      <h2 className="text-xl font-semibold mt-6 mb-2">Files</h2>
      <FilesList chatbotId={chatbot.id} />
      <h2 className="text-xl font-semibold mt-6 mb-2">Custom Configurations</h2>
      <Configurations configurations={chatbot.customConfigurations} />
    </div>
  )
}

export default ChatbotDetails
