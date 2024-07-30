"use client"
import { trpc } from '@/app/_trpc/client'
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'
import { Loader2, MessageSquare } from 'lucide-react'
import React, { useContext, useEffect, useRef, useCallback } from 'react'
import Skeleton from 'react-loading-skeleton'
import Message from './Message'
import { ChatContex } from './ChatContext'
import { useIntersection } from "@mantine/hooks"

interface MessagesProps {
  chatbotId: string
  theme:{
    primaryColor: string;
    secondaryColor: string;
    chatBubbleUserColor: string;
    chatBubbleBotColor: string;
    backgroundColor: string;
    font: string;
    fontSize: string;
    fontColor?: string;
  };
}

const Messages = ({ chatbotId, theme}: MessagesProps) => {
  let { isLoading: isAiThinking, addMessage, message, setMessage } = useContext(ChatContex)
  const { data, isLoading, fetchNextPage } = trpc.getChatbotMessages.useInfiniteQuery({
    chatbotId,
    limit: INFINITE_QUERY_LIMIT,
  }, {
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    keepPreviousData: true
  })

  const messages = data?.pages.flatMap((page) => page.messages)

  const loadingMessage = {
    createAt: new Date().toISOString(),
    id: 'loading-message',
    isUserMessage: false,
    text: (
      <span className='flex h-full items-center justify-center'>
        <Loader2 className='h-4 w-4 animate-spin'/>
      </span>
    )
  }
  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? [])
  ]

  const lastMessageRef = useRef<HTMLDivElement>(null)

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1
  })

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage()
    }
  }, [entry, fetchNextPage])

  const actionRef = useRef<string | null>(null)

  useEffect(() => {
    if (actionRef.current) {
      addMessage()
      actionRef.current = null
    }
  }, [message, addMessage])

  const handleActionClick = useCallback((actionType: string) => {
    let predefinedMessage
    switch (actionType) {
      case 'summary':
        predefinedMessage = 'Please summarize the document.'
        break
      case 'questions':
        predefinedMessage = 'Generate possible questions based on the document.'
        break
      case 'keyPoints':
        predefinedMessage = 'Extract key points from the document.'
        break
      default:
        return
    }
    actionRef.current = predefinedMessage
    setMessage(predefinedMessage)
  }, [setMessage])

  
  return (
    <div className='flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch whitespace-normal break-words'>
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, i) => {
          const isNextMessageSamePerson = combinedMessages[i - 1]?.isUserMessage ===
            combinedMessages[i]?.isUserMessage

          if (i === combinedMessages.length - 1) {
            return <Message
              ref={ref}
              message={message}
              isNextMessageSamePerson={isNextMessageSamePerson}
              key={message.id}
              theme={theme}
              chatbotId={chatbotId}
            />
          } else {
            return <Message
              message={message}
              isNextMessageSamePerson={isNextMessageSamePerson}
              key={message.id}
              theme={theme}
              chatbotId={chatbotId}
            />
          }
        })
      ) : isLoading ? (
        <div className='w-full flex-1 flex flex-col gap-3'>
          <Skeleton className='bg-zinc-300 dark:bg-zinc-800' count={10} />
        </div>
      ) : (
        <div className='mx-auto flex w-full flex-1 flex-col justify-center gap-3 p-4 text-center'>
          <MessageSquare className='mx-auto h-10 w-10 text-zinc-400' />
          <span className='text-sm text-zinc-400'>No messages</span>
        </div>
      )}
    </div>
  )
}

export default Messages
