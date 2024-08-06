import ConfigurableChatbot from '@/components/individualbot/ConfigurableChatbot'
import React from 'react'
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