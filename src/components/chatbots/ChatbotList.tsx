"use client"
import { trpc } from '@/app/_trpc/client'
import React, { useEffect, useState } from 'react'
import { useBusiness, useChatbot } from '../business/BusinessContext'
import { ChatbotProps } from '../business/types'
import Skeleton from 'react-loading-skeleton'
import { Ghost, Loader2, Trash, Calendar, MessageCircle } from 'lucide-react'
import { Button } from '../ui/button'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
    onSelect: (chatbot: ChatbotProps) => void
}

const ChatbotsList = ({ onSelect }: Props) => {
  const { currentBusiness } = useBusiness()
  const { setCurrentChatbot } = useChatbot()
  const [chatbots, setChatbots] = useState<any[]>([])
  const [currentDeletingChatbot, setCurrentDeletingChatbot] = useState<string | null>(null)

  //@ts-ignore
  const { mutate: getAllChatbots, isLoading } = trpc.getAllChatbots.useMutation({
    //@ts-ignore
    onSuccess: (data) => {
     setChatbots(data)
    },
  })

  const { mutate: deleteChatbot } = trpc.deleteChatbot.useMutation({
    onSuccess: () => {
      getAllChatbots({businessId: currentBusiness?.id!})
    },
    onMutate: ({ id }:any) => {
      setCurrentDeletingChatbot(id)
    },
    onSettled: () => {
      setCurrentDeletingChatbot(null)
    }
  })
  
  useEffect(() => {
    if(currentBusiness?.id){
      getAllChatbots({businessId: currentBusiness.id}) 
    } 
  }, [currentBusiness?.id, getAllChatbots])
  
  const handleSelectChatbot = (chatbot: ChatbotProps) => {
    setCurrentChatbot(chatbot)
    onSelect(chatbot)
  }

  const handleDeleteChatbot = (id: string) => {
    deleteChatbot({ id })
  }
  const getTotalMessageCount = (chatbot: any) => {
    console.log(chatbot)
    return chatbot.chatbotUsers.reduce((total: number, user: any) => {
      return total + (user.messages?.length || 0)
    }, 0)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (chatbots.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center gap-2 text-center">
        <Ghost className="h-16 w-16 text-gray-400" />
        <h3 className="font-semibold text-2xl">No chatbots yet</h3>
        <p className="text-gray-500">Create your first chatbot to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {chatbots.map((chatbot) => (
          <motion.div
            key={chatbot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6 cursor-pointer" onClick={() => handleSelectChatbot(chatbot)}>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">{chatbot.name}</h2>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{chatbot.systemInstruction}</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                Last Updated: {new Date(chatbot.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MessageCircle className="h-4 w-4 mr-2" />
                {getTotalMessageCount(chatbot) || 0} messages
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChatbot(chatbot.id);
                }}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                {currentDeletingChatbot === chatbot.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Chatbot
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ChatbotsList
