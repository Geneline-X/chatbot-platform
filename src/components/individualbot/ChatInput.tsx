"use client"

import React, { useContext, useRef } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Send } from 'lucide-react'
import { ChatContext } from './ChatContext'

interface ChatInputProps {
  isTypingIndicatorVisible: boolean
  isDisabled?: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({ isTypingIndicatorVisible, isDisabled }) => {
  const { sendMessage, handleInputChange, isLoading, message, theme } = useContext(ChatContext)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      sendMessage()
      textareaRef.current?.focus()
    }
  }

  return (
    <div className='absolute bottom-0 left-0 w-full' style={{ backgroundColor: theme.backgroundColor }}>
      <div className='mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
        <div className='relative flex h-full flex-1 items-stretch md:flex-col'>
          <div className='relative flex flex-col w-full flex-grow p-4'>
            <div className='relative'>
              {isTypingIndicatorVisible && <div className='typing-indicator' style={{ color: theme.primaryColor }}>Bot is typing...</div>}
              <Textarea
                placeholder='Enter your question...'
                rows={1}
                ref={textareaRef!}
                onChange={handleInputChange}
                value={message}
                maxRows={4}
                disabled={isLoading || isDisabled}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className='resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scroll-track-blue-lighter scrollbar-w-2 scrolling-touch'
                style={{
                  color: theme.primaryColor,
                  backgroundColor: theme.secondaryColor,
                  borderColor: theme.primaryColor
                }}
              />
              <Button
                disabled={isLoading || isDisabled}
                className='absolute bottom-1.5 right-[8px]'
                aria-label='send message'
                onClick={handleSendMessage}
                style={{
                  backgroundColor: theme.primaryColor,
                  color: theme.secondaryColor
                }}
              >
                <Send className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput
