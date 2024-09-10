"use client"
import React, { useState } from 'react'
import ChatbotsList from '@/components/chatbots/ChatbotList'
import InteractiveChatbotCreationAndDesign from '@/components/chatbots/InteractiveChatbotCreation'
import ChatbotDetails from '@/components/chatbots/ChatbotDetails'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

const Main = () => {
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
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8">Your Chatbots</h1>
            {selectedChatbot ? (
                <ChatbotDetails chatbot={selectedChatbot} onBack={() => setSelectedChatbot(null)} />
            ) : isCreating ? (
                <InteractiveChatbotCreationAndDesign onComplete={() => setIsCreating(false)} onCancel={() => setIsCreating(false)} />
            ) : (
                <div>
                    <Button onClick={handleCreateNew} className="mb-6 bg-blue-600 hover:bg-blue-700 text-white">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create New Chatbot
                    </Button>
                    <ChatbotsList onSelect={handleChatbotSelect} />
                </div>
            )}
        </div>
    )
}

export default Main