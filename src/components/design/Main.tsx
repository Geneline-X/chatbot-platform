"use client"

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { motion } from 'framer-motion'
import { HexColorPicker } from "react-colorful"
import { Slider } from "@/components/ui/slider"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { trpc } from '@/app/_trpc/client'
import { useChatbot } from '../business/BusinessContext'
import { toast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import useChatbotConfig from '@/lib/hooks/useChatbotConfig'
import ChatbotPreview from './ChatbotPreview'
import ProgressTracker from './ProgressTracker'
import { useUploadThing } from '@/lib/uploadthing'
import { Checkbox } from "@/components/ui/checkbox"


const DesignMain = () => {
  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      logo: '',
      theme: {
        primaryColor: '#000000',
        secondaryColor: '#FFFFFF',
        chatBubbleUserColor: '#E0E0E0',
        chatBubbleBotColor: '#007BFF',
        backgroundColor: '#F0F0F0',
        font: 'Arial',
        fontSize: 14
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
    }
  })

  const watchedFormData = watch()
  const router = useRouter()
  const createBrand = trpc.createBrand.useMutation()
  const { currentChatbot } = useChatbot()
  const { config } = useChatbotConfig(currentChatbot?.id ?? undefined)
  const { startUpload, isUploading } = useUploadThing('freePlanUploader')

  const onSubmit = async (data:any) => {
    if (!currentChatbot) {
      toast({
        title: "Please select a chatbot to customize",
        description: "Will be redirecting you to the chatbot page"
      })
      router.push("/chatbot-dashboard/chatbots")
      return
    }

    const input = {
      chatbotId: currentChatbot.id,
      name: currentChatbot.name,
      brandId: config?.id,
      ...data
    }

    createBrand.mutate(input, {
      onSuccess: () => {
        toast({ title: "Brand saved successfully" })
        router.push("/chatbot-dashboard/train")
      },
      onError: (error) => {
        console.error('Error saving brand', error)
        toast({ title: "Error saving brand", variant: "destructive" })
      }
    })
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0]
      const res = await startUpload([file])
      const [responseFile] = res || []
      if (responseFile) {
        setValue('logo', responseFile.url)
      }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white shadow-lg rounded-lg"
    >
      <h2 className="text-2xl font-bold mb-6">Design Your Chatbot</h2>
      <ProgressTracker currentStep={2} totalSteps={4} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Logo</h3>
            <Input type="file" onChange={handleLogoUpload} accept="image/*" />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Theme</h3>
            {['primaryColor', 'secondaryColor', 'chatBubbleUserColor', 'chatBubbleBotColor', 'backgroundColor'].map((color) => (
              <Controller
                key={color}
                name={`theme.${color}` as any}
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">{color}</label>
                    <HexColorPicker color={field?.value as string} onChange={field.onChange} />
                  </div>
                )}
              />
            ))}
            <Controller
              name="theme.font"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label htmlFor="font" className="block text-sm font-medium mb-1">Font</label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana'].map((font) => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <Controller
              name="theme.fontSize"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Font Size</label>
                  <Slider
                    min={10}
                    max={24}
                    step={1}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </div>
              )}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Widget</h3>
            <Controller
              name="widget.position"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label htmlFor="position" className="block text-sm font-medium mb-1">Position</label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['bottom-right', 'bottom-left', 'top-right', 'top-left'].map((position) => (
                        <SelectItem key={position} value={position}>{position}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <Controller
              name="widget.size"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label htmlFor="size" className="block text-sm font-medium mb-1">Size</label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['small', 'medium', 'large'].map((size) => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <Controller
              name="widget.welcomeMessage"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label htmlFor="welcomeMessage" className="block text-sm font-medium mb-1">Welcome Message</label>
                  <Input {...field} />
                </div>
              )}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Behavior</h3>
            <Controller
              name="behavior.showTypingIndicator"
              control={control}
              render={({ field }) => (
                <div className="flex items-center mb-4">
                  <Checkbox
                    id="showTypingIndicator"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label htmlFor="showTypingIndicator" className="ml-2">Show Typing Indicator</label>
                </div>
              )}
            />
            <Controller
              name="behavior.messageDelay"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Message Delay (ms)</label>
                  <Slider
                    min={0}
                    max={5000}
                    step={100}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </div>
              )}
            />
            <Controller
              name="behavior.autoRespondingHours"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label htmlFor="autoRespondingHours" className="block text-sm font-medium mb-1">Auto-responding Hours</label>
                  <Input {...field} />
                </div>
              )}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Advanced</h3>
            <Controller
              name="advanced.customCSS"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label htmlFor="customCSS" className="block text-sm font-medium mb-1">Custom CSS</label>
                  <textarea
                    className="w-full h-32 p-2 border rounded"
                    placeholder="Custom CSS"
                    {...field}
                  />
                </div>
              )}
            />
            <Controller
              name="advanced.chatHistory"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label htmlFor="chatHistory" className="block text-sm font-medium mb-1">Chat History</label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <Controller
              name="advanced.gdprCompliance"
              control={control}
              render={({ field }) => (
                <div className="mb-4">
                  <label htmlFor="gdprCompliance" className="block text-sm font-medium mb-1">GDPR Compliance</label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="enabled">Enabled</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
          </div>

          <Button type="submit" disabled={createBrand.isLoading || isUploading}>
            {createBrand.isLoading ? <Loader2 className='h-4 w-4 animate-spin'/> : 'Save & Continue'}
          </Button>
        </div>

        <div className="w-full md:w-1/2">
          <ChatbotPreview formData={watchedFormData} />
        </div>
      </form>
    </motion.div>
  )
}

export default DesignMain