import MainChatbot from '@/components/individualbot/Main'
import React from 'react'

interface ChatbotPageProps {
    params:{
        chatbotId: string
    }
}

const Page = ({ params } : ChatbotPageProps) => {
    const  { chatbotId } = params

  return (
    <div>
        {chatbotId}
        <MainChatbot/>
    </div>
  )
}

export default Page