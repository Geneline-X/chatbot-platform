"use client"
import React, { useEffect, useState } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import LogoSettings from './LogoSettings'
import ThemeSettings from './ThemeSettings'
import WidgetSettings from './WidgetSettings'
import BehaviorSettings from './BehaviourSettings'
import AdvancedSettings from './AdvancedSettings'
import { Button } from '@/components/ui/button'
import { trpc } from '@/app/_trpc/client'
import { useChatbot } from '../business/BusinessContext'
import { toast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import useChatbotConfig from '@/lib/hooks/useChatbotConfig'

const Main = () => {

  
  const [formData, setFormData] = useState({
    logo: '',
    theme: {
      primaryColor: '#000000',
      secondaryColor: '#FFFFFF',
      chatBubbleUserColor: '#E0E0E0',
      chatBubbleBotColor: '#007BFF',
      backgroundColor: '#F0F0F0',
      font: 'Arial',
      fontSize: '14px'
    },
    widget: {
      position: 'bottom-right',
      size: 'medium',
      welcomeMessage: 'Hi! How can I help you today?',
      botAvatar: ''
    },
    behavior: {
      showTypingIndicator: true,
      messageDelay: 1000,
      autoRespondingHours: '9am-5pm'
    },
    advanced: {
      customCSS: '',
      chatHistory: 'enabled',
      gdprCompliance: 'enabled'
    }
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
   
  const router = useRouter()
  const createBrand = trpc.createBrand.useMutation()

  const { currentChatbot } = useChatbot()
  const { config } = useChatbotConfig(currentChatbot?.id ?? undefined)
  console.log(config)
  const handleSave = () => {
    
    if (!currentChatbot) {
      toast({
        title: "Please select a chatbot to customize",
        description: "Will be redirecting you to the chatbot page"
      })
      router.push("/chatbot-dashboard/chatbots")
      return
    }
    
    const input = {
      chatbotId: currentChatbot?.id,
      name: currentChatbot?.name,
      brandId: config?.id,
      logo: formData.logo,
      theme: {
        theme: formData.theme,
        widget: formData.widget,
        behavior: formData.behavior,
        advanced: formData.advanced
      }
    }
    console.log("This is the values of the chatbot: ", input)

    setIsLoading(true)
    createBrand.mutate(input, {
      onSuccess: (data) => {
        console.log('Brand saved successfully', data)
        toast({
          title: "Brand saved successfully"
        })
       
      },
      onError: (error) => {
        console.error('Error saving brand', error)
      },
      onSettled: () => {
        setIsLoading(false)
      }
    })
  }

  const handleCancel = () => {
    // Handle cancel logic
  }

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Customize Your Chatbot</h2>
      <Tabs>
        <TabList>
          <Tab>Logo</Tab>
          <Tab>Theme</Tab>
          <Tab>Widget</Tab>
          <Tab>Behavior</Tab>
          <Tab>Advanced</Tab>
        </TabList>

        <TabPanel>
          <LogoSettings formData={formData} updateFormData={updateFormData} />
        </TabPanel>
        <TabPanel>
          <ThemeSettings formData={formData} updateFormData={updateFormData} />
        </TabPanel>
        <TabPanel>
          <WidgetSettings formData={formData} updateFormData={updateFormData} />
        </TabPanel>
        <TabPanel>
          <BehaviorSettings formData={formData} updateFormData={updateFormData} />
        </TabPanel>
        <TabPanel>
          <AdvancedSettings formData={formData} updateFormData={updateFormData} />
        </TabPanel>

      </Tabs>

      <div className="flex justify-end mt-4">
        <Button className="mr-2" variant={"secondary"} onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>{isLoading ? <Loader2 className='h-4 w-4 animate-spin'/> : 'Save'}</Button>
      </div>
    </div>
  )
}

export default Main
