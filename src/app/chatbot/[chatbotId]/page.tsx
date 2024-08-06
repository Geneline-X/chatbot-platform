"use client"

import React from 'react'
import StandaloneChatbot from '@/components/individualbot/StandaloneChatbot'
interface ChatbotPageProps {
    params:{
        chatbotId: string
    }
}

const Page = ({ params } : ChatbotPageProps) => {
    const  { chatbotId } = params

  return (
    <div>
        <StandaloneChatbot chatbotId={chatbotId}/>
    </div>
  )
}

export default Page