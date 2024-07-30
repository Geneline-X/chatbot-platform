"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Loader2, Copy } from 'lucide-react';
import { Button } from '../ui/button';

interface ChatMessageProps {
  text: string | React.ReactNode;
  isUser: boolean;
  theme: any;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text, isUser, theme, isLoading = false }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500); // Reset the copy state after 1.5 seconds
  };

  const messageStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '60%',
    backgroundColor: isUser ? theme.chatBubbleUserColor : theme.chatBubbleBotColor,
    color: isUser ? '#000' : '#FFF',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    textAlign: isUser ? 'right' : 'left',
    position: 'relative', // Added position relative for loader positioning
  };


  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={messageStyle}>
        {isLoading ? (
          <div>
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : typeof text === 'string' ? (
          <ReactMarkdown
            className="prose"
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                  {props.children}
                </a>
              ),
              code: ({ node, inlist, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inlist && match ? (
                    //@ts-ignore
                  <SyntaxHighlighter style={dark} language={match[1]} PreTag="div" {...props}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {text}
          </ReactMarkdown>
        ) : (
          text
        )}
        {!isLoading && (
          <div className="flex justify-end">
            <CopyToClipboard text={typeof text === 'string' ? text : ''} onCopy={handleCopy}>
              <button
                className={`text-xs flex cursor-pointer focus:outline-none ${
                  isUser ? 'text-zinc-100' : 'text-blue-400'
                }`}
              >
                {isCopied ? (
                  'Copied!'
                ) : (
                  <>
                    <Copy className="mr-2 w-4 h-4" /> Copy
                  </>
                )}
              </button>
            </CopyToClipboard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
