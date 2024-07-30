"use client"
import { trpc } from '@/app/_trpc/client'
import React, { useEffect, useState } from 'react'
import { useBusiness, useChatbot } from '../business/BusinessContext'
import { ChatbotProps } from '../business/types'
import Skeleton from 'react-loading-skeleton'
import { Ghost } from 'lucide-react'
interface Props {
    onSelect: (chatbot: ChatbotProps) => void
}

const ChatbotsList = ({ onSelect }: Props) => {
  
  const { currentBusiness } = useBusiness()
  const { setCurrentChatbot } = useChatbot()
  const [chatbots, setChatbots] = useState<ChatbotProps[]>([])
  //@ts-ignore
  const { mutate: getAllChatbots, isLoading} = trpc.getAllChatbots.useMutation({
    onSuccess: (data) => {
     setChatbots(data)
     
    },

  })
  
  useEffect(() => {
    if(currentBusiness?.id){
      const businessId:string = currentBusiness?.id
      getAllChatbots({businessId}) 
    } 
  }, [currentBusiness?.id, getAllChatbots])
  
  const handleSelectChatbot = (chatbot: ChatbotProps) => {
    setCurrentChatbot(chatbot)
    onSelect(chatbot)
  }
  return (
    <div className="p-4 space-y-4">
      {isLoading && <Skeleton height={100} className='my-2' count={3}/>}
      {!isLoading && chatbots.length === 0 && (
        <div className="mt-16 flex flex-col items-center gap-2">
        <Ghost className="h-8 w-8 text-zinc-800" />
        <h3 className="font-semibold text-xl">Pretty empty around here</h3>
        <p>Let&apos;s create your first chatbot.</p>
      </div>
      )}
      {chatbots.map((chatbot) => (
        <div
          key={chatbot.id}
          className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-100"
          onClick={() => handleSelectChatbot(chatbot)}
        >
          <h2 className="text-xl font-semibold">{chatbot.name}</h2>
          <p className="text-sm text-gray-500 mt-1">System Instruction: {chatbot.systemInstruction}</p>
          <p className="text-sm text-gray-500">Last Updated: {new Date(chatbot.updatedAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}

export default ChatbotsList
