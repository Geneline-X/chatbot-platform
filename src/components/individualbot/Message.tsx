"use client";

import { cn } from '@/lib/utils';
import React, { forwardRef, useState } from 'react';
import { Icons } from '../Icons';
import ReactMarkdown from "react-markdown";
import CopyToClipboard from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeRaw from 'rehype-raw';
import { Copy, Loader2 } from 'lucide-react';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  message: any;
  chatbotId: string;
  isNextMessageSamePerson: boolean;
  theme: {
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

const Message = forwardRef<HTMLDivElement, MessageProps>(({ message, isNextMessageSamePerson, theme, chatbotId }, ref) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const currentTime = new Date();
  const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div ref={ref} className={cn('flex items-end mb-4', {
      "justify-end": message.isUserMessage
    })}>
      <div className={cn("relative flex h-8 w-8 aspect-square items-center justify-center rounded-full", {
        "order-2 bg-blue-500": message.isUserMessage,
        "order-1": !message.isUserMessage,
        "invisible": isNextMessageSamePerson
      })} style={{ backgroundColor: message.isUserMessage ? theme.primaryColor : theme.secondaryColor }}>
        {message.isUserMessage ? (
          <Icons.user className='h-5 w-5' style={{ fill: theme.secondaryColor, color: theme.secondaryColor }} />
        ) : (
          <Icons.logo className='h-5 w-5' style={{ fill: theme.primaryColor, color: theme.primaryColor }} />
        )}
      </div>
      <div className={cn('flex flex-col space-y-2 text-base max-w-md mx-2', {
        "order-1 items-end": message.isUserMessage,
        "order-2 items-start": !message.isUserMessage
      })}>
        <div className={cn("px-4 py-2 rounded-lg inline-block shadow-md", {
          "rounded-br-none": !isNextMessageSamePerson && message.isUserMessage,
          "rounded-bl-none": !isNextMessageSamePerson && !message.isUserMessage,
        })} style={{
          backgroundColor: message.isUserMessage ? theme.chatBubbleUserColor : theme.chatBubbleBotColor,
          color: message.isUserMessage ? theme.primaryColor : theme.secondaryColor,
        }}>
          {isLoading && (
            <div className='mr-auto flex justify-end mb-2'>
              <Loader2 className='w-4 h-4 animate-spin' style={{ color: message.isUserMessage ? theme.primaryColor : theme.secondaryColor }} />
            </div>
          )}
          {typeof message.text === "string" ? (
            <ReactMarkdown
              className="prose"
              remarkPlugins={[remarkGfm]}
              components={{
                //@ts-ignore
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    //@ts-ignore
                    <SyntaxHighlighter
                      {...props}
                      style={dark}
                      language={match[1]}
                      PreTag="div"
                    >{String(children).replace(/\n$/, '')}</SyntaxHighlighter>
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  )
                },
                a: ({ node, ...props }) => (
                  <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    {props.children}
                  </a>
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          ) : (
            message.text
          )}
          {message.id !== 'loading-message' && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs opacity-50">{formattedTime}</span>
              <CopyToClipboard text={message.text as string} onCopy={handleCopy}>
                <button className="text-xs flex items-center cursor-pointer focus:outline-none opacity-50 hover:opacity-100 transition-opacity">
                  {isCopied ? 'Copied!' : (
                    <>
                      <Copy className='mr-1 w-3 h-3' />
                      Copy
                    </>
                  )}
                </button>
              </CopyToClipboard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

Message.displayName = 'Message';

export default Message;