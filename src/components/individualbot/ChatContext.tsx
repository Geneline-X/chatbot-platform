"use client"
import React, { ReactNode, createContext, useState, useRef } from 'react'
import { useToast } from '../ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { trpc } from '@/app/_trpc/client'
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'

type StreamResponseType = {
    addMessage: () => void,
    setMessage: React.Dispatch<React.SetStateAction<string>> 
    message: string,
    handleInputChange: (event:React.ChangeEvent<HTMLTextAreaElement>) => void,
    isLoading: boolean
}

export const ChatContex = createContext<StreamResponseType>({
    addMessage: () => {},
    message: "",
    setMessage: () => {},
    handleInputChange: () => {},
    isLoading: false
})

interface Props {
    chatbotId: string
    children: ReactNode
}

export const ChatContextProvider = ({chatbotId, children}: Props) => {
   const [message, setMessage] = useState<string>("")
   const [isLoading, setIsLoading] = useState<boolean>(false)
  
   const utils = trpc.useContext()
   const { toast } = useToast()

   const backupMessage = useRef("")
   const completeMessage = useRef<string>("")

   const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
        const response = await fetch("/api/message", {
            method: "POST",
            body: JSON.stringify({
                chatbotId,
                message
            }),
        })
        if (!response.ok) {
            throw new Error("Failed to send message")
        }
        return response.body
    },
    onMutate: async ({ message }) => {
        backupMessage.current = message
        setMessage("")

        await utils.getChatbotMessages.cancel()

        const previousMessages = utils.getChatbotMessages.getInfiniteData()

        utils.getChatbotMessages.setInfiniteData(
            { chatbotId, limit: INFINITE_QUERY_LIMIT },
            (old) => {
                if (!old) {
                    return { pages: [], pageParams: [] }
                }

                let newPages = [...old.pages]
                let latestPage = newPages[0]!

                latestPage.messages = [
                    {
                        createAt: new Date().toISOString(),
                        id: crypto.randomUUID(),
                        text: message,
                        chatbotId,
                        isUserMessage: true
                    },
                    ...latestPage.messages
                ]
                newPages[0] = latestPage

                return { ...old, pages: newPages }
            }
        )

        setIsLoading(true)
        return { previousMessages: previousMessages?.pages.flatMap((page) => page.messages) ?? [] }
    },
    onSuccess: async (stream) => {
        if (!stream) {
            return toast({
                title: "There was a problem sending this message",
                description: "Please refresh this page and try again",
                variant: "destructive"
            })
        }

        const reader = stream.getReader()
        const decoder = new TextDecoder()
        let done = false
        let accResponse = ""

        while (!done) {
            const { value, done: doneReading } = await reader.read()
            done = doneReading
            const chunkValue = decoder.decode(value)
            accResponse += chunkValue

            utils.getChatbotMessages.setInfiniteData(
                { chatbotId, limit: INFINITE_QUERY_LIMIT },
                (old: any) => {
                    if (!old) return { pages: [], pageParams: [] }

                    let isAiResponseCreated = old.pages.some((page: any) =>
                        page.messages.some((message: any) => message.id === 'ai-response')
                    )

                    let updatedPages = old.pages.map((page: any) => {
                        if (page === old.pages[0]) {
                            let updatedMessages
                            if (!isAiResponseCreated) {
                                updatedMessages = [
                                    {
                                        createAt: new Date().toISOString(),
                                        id: 'ai-response',
                                        text: accResponse,
                                        isUserMessage: false
                                    },
                                    ...page.messages
                                ]
                            } else {
                                updatedMessages = page.messages.map((message: any) => {
                                    if (message.id === 'ai-response') {
                                        return {
                                            ...message,
                                            text: accResponse
                                        }
                                    }
                                    return message
                                })
                            }

                            return { ...page, messages: updatedMessages }
                        }
                        return page
                    })
                    return { ...old, pages: updatedPages }
                }
            )
        }

        setIsLoading(false)
    },
    onError: (_, __, context) => {
        setIsLoading(false)
        setMessage(backupMessage.current)
        utils.getChatbotMessages.setData(
            { chatbotId },
            { messages: context?.previousMessages ?? [] }
        )
    },
    onSettled: async () => {
        setIsLoading(false)
        await utils.getChatbotMessages.invalidate({ chatbotId })
    }
   })

   const addMessage = () => {
    sendMessage({ message })
   }

   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
     setMessage(e.target.value)
   }

   return (
    <ChatContex.Provider value={{
        addMessage,
        message,
        handleInputChange,
        isLoading, 
        setMessage
    }}>
        {children}
    </ChatContex.Provider>
   )
}
