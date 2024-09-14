"use client"

import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { motion } from 'framer-motion'
import { HexColorPicker } from "react-colorful"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { trpc } from '@/app/_trpc/client'
import { useChatbot } from '../business/BusinessContext'
import { toast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import useChatbotConfig from '@/lib/hooks/useChatbotConfig'
import ChatbotPreview from './ChatbotPreview'
import ProgressTracker from './ProgressTracker'
import { useUploadThing } from '@/lib/uploadthing'

const defaultValues = {
  logo: '',
  theme: {
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
    }
  }
}

const DesignMain = () => {
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues
  })

  const watchedFormData = watch()
  const router = useRouter()
  const createBrand = trpc.createBrand.useMutation()
  const { currentChatbot } = useChatbot()
  const { config, isLoading: isConfigLoading } = useChatbotConfig(currentChatbot?.id ?? undefined)
  const { startUpload, isUploading } = useUploadThing('freePlanUploader')

  console.log('Loaded config:', config)
  useEffect(() => {
    if (!isConfigLoading && config) {
      console.log('Loaded config:', config)
      reset({
        logo: config.logo || defaultValues.logo,
        theme: {
          //@ts-ignore
          theme: { ...defaultValues.theme.theme, ...config.theme?.theme },
          //@ts-ignore
          widget: { ...defaultValues.theme.widget, ...config.theme?.widget }
        }
      })
    }
    //@ts-ignore
  }, [config, isConfigLoading, reset])

  const onSubmit = async (data: any) => {
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
      logo: data.logo,
      theme: data.theme // This now includes both theme and widget
    }

    console.log('Submitting data:', input)

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

  const handleBack = () => {
    router.push('/chatbot-dashboard/chatbots')
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Chatbots
        </Button>
        <h2 className="text-2xl font-bold text-center flex-grow">Design Your Chatbot</h2>
        <div className="w-[100px]"></div> {/* This empty div balances the layout */}
      </div>
      
      <ProgressTracker currentStep={2} totalSteps={4} />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Logo</h3>
              <Input type="file" onChange={handleLogoUpload} accept="image/*" />
              {watchedFormData.logo && (
                <img src={watchedFormData.logo} alt="Logo preview" className="mt-4 max-w-xs rounded-lg shadow" />
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Theme</h3>
              {['primaryColor', 'secondaryColor', 'chatBubbleUserColor', 'chatBubbleBotColor', 'backgroundColor'].map((color) => (
                <Controller
                  key={color}
                  name={`theme.theme.${color}` as any}
                  control={control}
                  render={({ field }) => (
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">{color}</label>
                      <div className="flex items-center space-x-4">
                        <HexColorPicker color={field.value} onChange={field.onChange} />
                        <Input 
                          type="text" 
                          value={field.value} 
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-28"
                        />
                      </div>
                    </div>
                  )}
                />
              ))}
              <Controller
                name="theme.theme.font"
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <label htmlFor="font" className="block text-sm font-medium mb-2">Font</label>
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
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Widget</h3>
              <Controller
                name="theme.widget.position"
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <label htmlFor="position" className="block text-sm font-medium mb-2">Position</label>
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
                name="theme.widget.size"
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <label htmlFor="size" className="block text-sm font-medium mb-2">Size</label>
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
                name="theme.widget.welcomeMessage"
                control={control}
                render={({ field }) => (
                  <div className="mb-4">
                    <label htmlFor="welcomeMessage" className="block text-sm font-medium mb-2">Welcome Message</label>
                    <Input {...field} />
                  </div>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={createBrand.isLoading || isUploading}>
              {createBrand.isLoading ? <Loader2 className='h-4 w-4 animate-spin mr-2'/> : null}
              Save & Continue
            </Button>
          </form>
        </div>

        <div className="w-full lg:w-1/2 sticky top-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <ChatbotPreview formData={watchedFormData} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default DesignMain