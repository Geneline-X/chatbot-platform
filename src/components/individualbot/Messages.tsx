"use client"
import { trpc } from '@/app/_trpc/client'
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query'
import { Loader2, MessageSquare } from 'lucide-react'
import React, { useContext, useEffect, useRef, useCallback, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import Message from './Message'
import { ChatContex } from './ChatContext'
import { useIntersection } from "@mantine/hooks"
import EmailPromptForm from './EmailPromptForm'
import useChatbotConfig from '@/lib/hooks/useChatbotConfig'
import { getSession, storeMessage, clearMessages } from '../../lib/utils';

interface MessagesProps {
  chatbotId: string
  welcomeMessage:string
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

const Messages = ({ chatbotId, theme, welcomeMessage}: MessagesProps) => {
  let { isLoading: isAiThinking, addMessage, message, setMessage, email, setEmail } = useContext(ChatContex)
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [showEmailPrompt, setShowEmailPrompt] = useState(true);
  
  const sessionId = getSession();

  const { data, isLoading, fetchNextPage } = trpc.getChatbotMessages.useInfiniteQuery({
    chatbotId,
    limit: INFINITE_QUERY_LIMIT,
    email: email || '',
    sessionId: email ? undefined : sessionId! 
  }, {
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    keepPreviousData: true
  })

  const messages = data?.pages.flatMap((page) => page.messages)

  console.log(messages)
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
  const combinedMessages = React.useMemo(() => {
    return [
      ...(isAiThinking ? [loadingMessage] : []),
      ...(messages ?? [])
    ];
  }, [isAiThinking, messages]);

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

  

  const handleEmailSubmit = (email: string) => {
    setEmail(email);
    console.log(email)
    setShowEmailPrompt(false);
    clearMessages();
  };

  const handleSkip = () => {
    console.log('clicked')
    setShowEmailPrompt(false);
  }

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


  if (messages?.length === 0 && showEmailPrompt) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmailPromptForm 
          onEmailSubmit={handleEmailSubmit} 
          onSkip={handleSkip} 
          theme={theme}
          welcomeMessage={welcomeMessage}
        />
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col-reverse gap-4 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
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
        <div className='flex-1 flex flex-col items-center justify-center gap-3 p-4 text-center'>
          <MessageSquare className='h-10 w-10 text-zinc-400' />
          <span className='text-sm text-zinc-400'>{welcomeMessage}</span>
        </div>
      )}
    </div>
  )
}

export default Messages
