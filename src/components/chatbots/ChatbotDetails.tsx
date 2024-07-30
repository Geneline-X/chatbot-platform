"use client"
import React, {useState} from 'react'
import MessagesList from "../MessageList"
import FilesList from "../FilesList"
import Configurations from "../Configurations"
import { useChatbot } from '../business/BusinessContext'
import { ChatbotDetailsProps } from '@/types/mainTypes'
import { useRouter } from 'next/navigation'
import { Button, buttonVariants } from '../ui/button'
import { toast } from '../ui/use-toast'
import Link from 'next/link'
import ExportChatbotModal from './ExportChatbotModal'
import { Loader2 } from 'lucide-react'

const ChatbotDetails = ({ chatbot, onBack }: ChatbotDetailsProps) => {
  const router = useRouter()
  const { currentChatbot, setCurrentChatbot } = useChatbot()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCustomizeClick = () => {
    setCurrentChatbot(chatbot)
    toast({
      title: `Chatbot with name ${currentChatbot?.name} selected for customization`,
      description: "We will redirect to the design page in a jiffy",
    })
    router.push("/chatbot-dashboard/design")
  }
  const handleTrainClick = () => {
    setCurrentChatbot(chatbot)
    toast({
      title: `Chatbot with name ${currentChatbot?.name} selected for training`,
      description: "We will redirect to the design page in a jiffy",
    })
    router.push("/chatbot-dashboard/train")
  }

  const handleChatbotExport = async() => {
    try {
      toast({
        title: "Chatbot exported publicly",
        description: "Now anyone with the url can access it"
      })
      setIsModalOpen(true);
      router.push(`/chatbot/${chatbot.id}`)
      setEmbedCode(`${process.env.NEXT_PUBLIC_ABSOLUTE_URL}/chatbot/${chatbot.id}`);
      
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className='flex justify-between'>
      <button
        className="mb-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        onClick={onBack}
      >
        Back to Chatbots List
      </button>
      <div>
       <Button className='mr-5' onClick={handleChatbotExport}>
         {loading ? <Loader2 className='h-4 w-4 animate-spin'/> : "Export"}
       </Button>
       {/* Modal to display the code to copy and paste in one site */}
       <ExportChatbotModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} embedCode={embedCode}/>

        <Link href={`/chatbot-dashboard/chatbots/${chatbot.id}`}
          className={buttonVariants({
          })}
          >
            Chat with your bot
          </Link>
        </div>
      </div>
      

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{chatbot.name}</h1>
        <p className="text-gray-700">{chatbot.systemInstruction}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Messages</h2>
        <MessagesList chatbotId={chatbot.id} />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Files</h2>
        <FilesList chatbotId={chatbot.id} />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Custom Configurations</h2>
        <Configurations configurations={chatbot.customConfigurations} />
      </div>

      <div className="flex space-x-4">
        <Button
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={handleCustomizeClick}
        >
          Customize Design
        </Button>
        <Link href="/chatbot-dashboard/train"
        className={buttonVariants({
          className: "mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors",
        })}
        onClick={handleTrainClick}
        >
          Train Chatbot
        </Link>
      </div>
    </div>
  )
}

export default ChatbotDetails
