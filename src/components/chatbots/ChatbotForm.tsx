"use client"
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label  } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ConfigurationForm from './ConfigurationForm'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useBusiness } from '../business/BusinessContext'

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
    businessId:string
    systemInstruction:string
    urlsToBusinessWebsite:string
    customConfigurations:ConfigurableParameters | null
  }>({
  name: "",
  businessId: "",
  systemInstruction: "",
  urlsToBusinessWebsite: "",
  customConfigurations: null
  })

  const [configParams, setConfigParams] = useState<ConfigurableParameters>({
    topP: 0.9,
    topK: 40,
    temperature: 0.7,
    stopSequence: '',
    maxOutputLength: 2040,
    responseCandidates: 1,
  });

  const [name, setName] = useState('')
  const [businessId, setBusinessId] = useState('')
  const [systemInstruction, setSystemInstruction] = useState('')
  const [urlsToBusinessWebsite, setUrlsToBusinessWebsite] = useState('')
  const [customConfigurations, setCustomConfigurations] = useState({})
  const { currentBusiness } = useBusiness()
  console.log("this is the current business: ", currentBusiness)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleSubmit = () => {
    // Handle form submission logic
    onSave()
  }
  const handleInputChange = () => {

  }

  const handleConfigChange = (param: keyof ConfigurableParameters, value: any) => {
    setConfigParams((prevParams) => ({
      ...prevParams,
      [param]: value,
    }));
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <div className='flex justify-between'>
      <h2 className="text-xl font-semibold mb-4">Create/Edit Chatbot</h2>
      <div className="mb-4">
          <Dialog  open={isOpen} onOpenChange={(v) => {
                if(!v){
                    setIsOpen(v)
                }
            }}>
            <DialogTrigger asChild onClick={() => setIsOpen(true)}>
                <Button>Settings</Button>
            </DialogTrigger>
            <DialogContent>
                <ConfigurationForm/>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label>Name</Label>
          <Input
            type="text"
            width={"full"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label>Use of the Chatbot</Label>
          <Textarea
            minRows={4}
            placeholder='Needed a customer service chatbot'
            value={systemInstruction}
            onChange={(e) => setSystemInstruction(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label>URLs to Business Website</Label>
          <Input
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            value={urlsToBusinessWebsite}
            onChange={(e) => setUrlsToBusinessWebsite(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <Button type="button" className="p-2 bg-gray-500 text-white rounded" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ChatbotForm
