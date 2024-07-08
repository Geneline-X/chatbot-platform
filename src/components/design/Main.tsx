"use client"
import React, { useState } from 'react'
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

const Main = () => {

  const { currentChatbot } = useChatbot()

  const [logo, setLogo] = useState<string | undefined>(undefined)
  const [theme, setTheme] = useState<any>(null)
  const [widget, setWidget] = useState<any>(null)
  const [behavior, setBehavior] = useState<any>(null)
  const [advanced, setAdvanced] = useState<any>(null)

  const router = useRouter()
  const createBrand = trpc.createBrand.useMutation()

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
      logo,
      theme: {
        theme,
        widget,
        behavior,
        advanced
      }
    }
    console.log("This is the values of the chatbot: ", input)

    // createBrand.mutate(input, {
    //   onSuccess: (data) => {
    //     console.log('Brand saved successfully', data)
    //     // Additional success handling if needed
    //     toast({
    //       title: "Brand saved successfully"
    //     })
    //   },
    //   onError: (error) => {
    //     console.error('Error saving brand', error)
    //     // Additional error handling if needed
    //   }
    // })
  }

  const handleCancel = () => {
    // Handle cancel logic
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
          <LogoSettings setLogoUrl={setLogo}/>
        </TabPanel>
        <TabPanel>
          <ThemeSettings setThemeProps={setTheme}/>
        </TabPanel>
        <TabPanel>
          <WidgetSettings setWidgetProps={setWidget}/>
        </TabPanel>
        <TabPanel>
          <BehaviorSettings setBehaviorProps={setBehavior}/>
        </TabPanel>
        <TabPanel>
          <AdvancedSettings setAdvancedProps={setAdvanced}/>
        </TabPanel>
      </Tabs>

      <div className="flex justify-end mt-4">
        <Button className="mr-2" variant={"secondary"} onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}

export default Main
