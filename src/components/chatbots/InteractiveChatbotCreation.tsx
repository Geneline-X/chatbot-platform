"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { useBusiness, useChatbot } from '../business/BusinessContext'
import { trpc } from '@/app/_trpc/client'
import { Loader2 } from 'lucide-react'
import { toast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'

interface Step {
    title: string;
    description: string;
    field: string;
    component: React.ReactNode;
}

const InteractiveChatbotCreation = ({ onComplete, onCancel }:any) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [chatbotData, setChatbotData] = useState({
        name: "",
        systemInstruction: "",
        urlsToBusinessWebsite: "",
        topP: 0.9,
        temperature: 0.7,
        maxOutputLength: 2040,
    })

    const { currentBusiness } = useBusiness()
    const { setCurrentChatbot } = useChatbot()
    const router = useRouter()

    //@ts-ignore
    const { mutate: createChatbot, isLoading } = trpc.createChatbot.useMutation({
      //@ts-ignore
        onSuccess: (data) => {
            toast({ title: `Chatbot "${data.name}" created successfully!` })
            setCurrentChatbot(data)
            onComplete()
            router.push("/chatbot-dashboard/design")
        },
        onError: (error) => {
            toast({ title: "Error creating chatbot", description: error.message, variant: "destructive" })
        }
    })

    const steps: Step[] = [
        {
            title: "Name your chatbot",
            description: "Choose a name that reflects your chatbot's purpose.",
            field: "name",
            component: (
                <Input
                    value={chatbotData.name}
                    onChange={(e) => setChatbotData({ ...chatbotData, name: e.target.value })}
                    placeholder="e.g., Customer Support Bot"
                />
            )
        },
        {
            title: "Define your chatbot's purpose",
            description: "Describe what your chatbot should do and how it should interact.",
            field: "systemInstruction",
            component: (
                <Textarea
                    value={chatbotData.systemInstruction}
                    onChange={(e) => setChatbotData({ ...chatbotData, systemInstruction: e.target.value })}
                    placeholder="e.g., You are a friendly customer support assistant for a tech company..."
                />
            )
        },
        {
            title: "Add your business website",
            description: "Provide URLs that contain information for your chatbot to learn from.",
            field: "urlsToBusinessWebsite",
            component: (
                <Input
                    value={chatbotData.urlsToBusinessWebsite}
                    onChange={(e) => setChatbotData({ ...chatbotData, urlsToBusinessWebsite: e.target.value })}
                    placeholder="https://your-business-website.com"
                />
            )
        },
        {
            title: "Adjust creativity",
            description: "Set how creative your chatbot's responses should be. Higher values mean more creative, but potentially less accurate responses.",
            field: "topP",
            component: (
                <Slider
                    value={[chatbotData.topP]}
                    onValueChange={(value) => setChatbotData({ ...chatbotData, topP: value[0] })}
                    max={1}
                    step={0.1}
                />
            )
        },
        {
            title: "Set response randomness",
            description: "Determine how random your chatbot's responses should be. Higher values introduce more variability in responses.",
            field: "temperature",
            component: (
                <Slider
                    value={[chatbotData.temperature]}
                    onValueChange={(value) => setChatbotData({ ...chatbotData, temperature: value[0] })}
                    max={1}
                    step={0.1}
                />
            )
        },
        {
            title: "Set maximum response length",
            description: "Choose the maximum length of your chatbot's responses. Longer responses can be more detailed but may take longer to generate.",
            field: "maxOutputLength",
            component: (
                <Slider
                    value={[chatbotData.maxOutputLength]}
                    onValueChange={(value) => setChatbotData({ ...chatbotData, maxOutputLength: value[0] })}
                    max={4000}
                    step={100}
                />
            )
        }
    ]

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            createChatbot({ ...chatbotData, businessId: currentBusiness?.id! })
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        } else {
            onCancel()
        }
    }

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">{steps[currentStep].title}</h2>
            <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>
            <div className="mb-6">
                {steps[currentStep].component}
            </div>
            <div className="flex justify-between">
                <Button onClick={handlePrevious}>
                    {currentStep === 0 ? 'Cancel' : 'Previous'}
                </Button>
                <Button onClick={handleNext} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {currentStep === steps.length - 1 ? 'Create Chatbot' : 'Next'}
                </Button>
            </div>
            <div className="mt-4 flex justify-center">
                <span className="text-sm text-gray-500">
                    Step {currentStep + 1} of {steps.length}
                </span>
            </div>
        </div>
    )
}

export default InteractiveChatbotCreation