"use client"
import React, { useState } from 'react'
import ChatbotsList from '@/components/chatbots/ChatbotList'
import ChatbotForm from '@/components/chatbots/ChatbotForm'
import ChatbotDetails from '@/components/chatbots/ChatbotDetails'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { Button } from '@/components/ui/button'

interface Props {}

const Page = () => {
    const [selectedChatbot, setSelectedChatbot] = useState(null)
    const [isCreating, setIsCreating] = useState(false)
  
    const handleChatbotSelect = (chatbot:any) => {
      setSelectedChatbot(chatbot)
      setIsCreating(false)
    }
  
    const handleCreateNew = () => {
      setSelectedChatbot(null)
      setIsCreating(true)
    }

  return (
    <MaxWidthWrapper>
       <h1 className="text-2xl font-bold mb-4">Chatbots</h1>
      {selectedChatbot ? (
        <ChatbotDetails chatbot={selectedChatbot} onBack={() => setSelectedChatbot(null)} />
      ) : isCreating ? (
        <ChatbotForm onSave={() => setIsCreating(false)} onCancel={() => setIsCreating(false)} />
      ) : (
        <div>
          <Button  onClick={handleCreateNew}>
            Create New Chatbot
          </Button>
          <ChatbotsList onSelect={handleChatbotSelect} />
        </div>
      )}
  </MaxWidthWrapper>
  )
}

export default Page