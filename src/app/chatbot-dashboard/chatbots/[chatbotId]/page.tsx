import ConfigurableChatbot from '@/components/individualbot/ConfigurableChatbot'
import MainChatbot from '@/components/individualbot/Main'
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
      <>
        <ConfigurableChatbot chatbotId={chatbotId}/>
      </>
    
  )
}

export default Page