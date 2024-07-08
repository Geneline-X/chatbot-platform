"use client"
import { Input } from '@/components/ui/input'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ConfigurationForm from './ConfigurationForm'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useBusiness, useChatbot } from '../business/BusinessContext'
import { trpc } from '@/app/_trpc/client'
import { Loader2 } from 'lucide-react';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation'

interface Props {
    onSave: () => void
    onCancel: () => void
}
export interface ConfigurableParameters {
    topP: number;
    topK: number;
    temperature: number;
    stopSequence: string;
    maxOutputLength: number;
    responseCandidates: number;
}

const ChatbotForm = ({ onSave, onCancel }: Props) => {
  const [chatbot, setChatbot] = useState<{
    name: string;
    businessId: string;
    systemInstruction: string;
    urlsToBusinessWebsite: string;
    customConfigurations: ConfigurableParameters | null;
  }>({
    name: "",
    businessId: "",
    systemInstruction: "",
    urlsToBusinessWebsite: "",
    customConfigurations: null,
  })

  const [configParams, setConfigParams] = useState<ConfigurableParameters>({
    topP: 0.9,
    topK: 40,
    temperature: 0.7,
    stopSequence: '',
    maxOutputLength: 2040,
    responseCandidates: 1,
  });

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { currentBusiness } = useBusiness()
  const { setCurrentChatbot } = useChatbot()
  const router = useRouter()

  useEffect(() => {
    if (currentBusiness) {
      setChatbot((prevChatbot) => ({
        ...prevChatbot,
        businessId: currentBusiness.id
      }));
    }
  }, [currentBusiness]);

  const handleInputChange = (field: keyof typeof chatbot, value: any) => {
    setChatbot((prevChatbot) => ({
      ...prevChatbot,
      [field]: value,
    }));
  }

  const handleConfigChange = (param: keyof ConfigurableParameters, value: any) => {
    setConfigParams((prevParams) => ({
      ...prevParams,
      [param]: value,
    }));
  };

  //@ts-ignore
  const { mutate: createChatbot, isLoading } = trpc.createChatbot.useMutation({
    onSuccess: (data) => {
      toast({
        title: `Chatbot created successfully with the name ${data.name}`,
      })
      onSave();
      setCurrentChatbot(data)
      router.push("/chatbot-dashboard/design")
    },
    onError: (error:any) => {
      console.error('Error creating chatbot:', error);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createChatbot({
      ...chatbot,
      customConfigurations: configParams
    })
    console.log("this is the chatbot data: ", chatbot)
  }

  return (
    <div className="p-4 bg-white shadow rounded">
      <div className='flex justify-between'>
        <h2 className="text-xl font-semibold mb-4">Create/Edit Chatbot</h2>
        <div className="mb-4">
          <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsOpen(true)}>Settings</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>
              
              </DialogTitle>
              <ConfigurationForm 
              configParams={configParams} 
              onConfigChange={handleConfigChange} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label>Name</Label>
          <Input
            type="text"
            value={chatbot.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label>Use of the Chatbot</Label>
          <Textarea
            minRows={4}
            placeholder='Needed a customer service chatbot'
            value={chatbot.systemInstruction}
            onChange={(e) => handleInputChange('systemInstruction', e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label>URLs to Business Website</Label>
          <Input
            type="text"
            value={chatbot.urlsToBusinessWebsite}
            onChange={(e) => handleInputChange('urlsToBusinessWebsite', e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <Button type="button" className="p-2 bg-gray-500 text-white rounded" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatbotForm
