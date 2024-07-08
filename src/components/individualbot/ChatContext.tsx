"use client"
import React, { createContext, useState, useEffect } from 'react'

interface ChatContextProps {
  theme: any
  widget: any
  behavior: any
  advanced: any
  messages: any[]
  message: string
  sendMessage: () => void
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  isLoading: boolean
}

export const ChatContext = createContext<ChatContextProps>({
  theme: {},
  widget: {},
  behavior: {},
  advanced: {},
  messages: [],
  message: '',
  sendMessage: () => {},
  handleInputChange: () => {},
  isLoading: false
})

interface ChatContextProviderProps {
  children: React.ReactNode
  theme: any
  widget: any
  behavior: any
  advanced: any
}

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children, theme, widget, behavior, advanced }) => {
  const [messages, setMessages] = useState<any[]>([])
  const [message, setMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const sendMessage = () => {
    if (message.trim() === '') return

    const newMessage = { text: message, isUser: true }
    setMessages([...messages, newMessage])
    setMessage('')

    // Simulate bot response
    setIsLoading(true)
    setTimeout(() => {
      const botMessage = { text: `Bot response to: ${message}`, isUser: false }
      setMessages((prevMessages) => [...prevMessages, botMessage])
      setIsLoading(false)
    }, behavior.messageDelay)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  return (
    <ChatContext.Provider value={{ theme, widget, behavior, advanced, messages, message, sendMessage, handleInputChange, isLoading }}>
      {children}
    </ChatContext.Provider>
  )
}
