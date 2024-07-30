"use client"

import React, { useEffect, useState, useRef } from 'react';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Send, X, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const defaultTheme = {
  primaryColor: '#007BFF',
  secondaryColor: '#FFFFFF',
  chatBubbleUserColor: '#E0E0E0',
  chatBubbleBotColor: '#007BFF',
  backgroundColor: '#F0F0F0',
  font: 'Arial',
  fontSize: '14px'
};

interface ConfigurableChatbotProps {
  chatbotId: string;
}

const ConfigurableChatbot: React.FC<ConfigurableChatbotProps> = ({ chatbotId }) => {
  const [config, setConfig] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [theme, setTheme] = useState(defaultTheme);
  const [widget, setWidget] = useState({
    position: 'bottom-right',
    size: 'medium',
    welcomeMessage: 'Hi! How can I help you today?',
    botAvatar: ''
  });
  const [message, setMessage] = useState<string>('');
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const brandResponse = await fetch(`/api/trpc/getBrand?batch=1&input=${encodeURIComponent(JSON.stringify({ "1": { chatbotId } }))}`);
        const brandData = await brandResponse.json();
        
        const messagesResponse = await fetch(`/api/trpc/getChatbotMessages?batch=1&input=${encodeURIComponent(JSON.stringify({ "2": { chatbotId, limit: 10 } }))}`);
        const messagesData = await messagesResponse.json();

        setConfig(brandData);
        setMessages(messagesData);
      } catch (err) {
        setError('Error loading chatbot configuration');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [chatbotId]);

  useEffect(() => {
    if (config?.theme) {
      setTheme(config.theme || defaultTheme);
      setWidget(prev => ({
        ...prev,
        botAvatar: config.logo || '',
        welcomeMessage: config.theme?.widget?.welcomeMessage || 'Hi! How can I help you today?'
      }));
    }
  }, [config]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    setMessages([...messages, { text: message, isUserMessage: true }]);
    setMessage('');
    setIsAiThinking(true);

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({ chatbotId, message })
      });
      const responseBody = await response.json();
      setMessages(prev => [...prev, { text: responseBody, isUserMessage: false }]);
    } catch (err) {
      console.error('Error sending message', err);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const chatContainerStyle: React.CSSProperties = {
    backgroundColor: theme.backgroundColor,
    fontFamily: theme.font,
    fontSize: theme.fontSize,
    width: '100%',
    height: '100%',
    border: `1px solid ${theme.primaryColor}`,
    borderRadius: '10px',
    overflow: 'hidden',
    zIndex: 1000,
    transition: 'all 0.3s ease'
  };

  return (
    <div style={chatContainerStyle}>
      <div className="chat-header" style={{ backgroundColor: theme.primaryColor, color: theme.secondaryColor, padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {widget.botAvatar && <img src={widget.botAvatar} alt="Bot Avatar" style={{ width: '40px', borderRadius: '50%' }} />}
          <h2 style={{ marginLeft: '10px' }}>{widget.welcomeMessage}</h2>
        </div>
        <button
          onClick={() => {}}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: theme.secondaryColor,
            cursor: 'pointer',
            fontSize: '20px'
          }}
          aria-label="Close chat"
        >
          <X />
        </button>
      </div>
      <div className="chat-messages" style={{ padding: '10px', height: '300px', overflowY: 'auto', backgroundColor: theme.secondaryColor }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ margin: '10px 0', display: 'flex', justifyContent: msg.isUserMessage ? 'flex-end' : 'flex-start' }}>
            <div style={{ backgroundColor: msg.isUserMessage ? theme.chatBubbleUserColor : theme.chatBubbleBotColor, padding: '10px', borderRadius: '10px', color: '#FFFFFF', maxWidth: '70%' }}>
              <ReactMarkdown
                className="prose"
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      {props.children}
                    </a>
                  )
                }}
              >
                {msg.text as string}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isAiThinking && (
          <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ backgroundColor: theme.chatBubbleBotColor, padding: '10px', borderRadius: '10px', color: '#FFFFFF', maxWidth: '70%' }}>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>
      <div className='absolute bottom-0 left-0 w-full' style={{ backgroundColor: theme.backgroundColor }}>
        <div className='mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl'>
          <div className='relative flex h-full flex-1 items-stretch md:flex-col'>
            <div className='relative flex flex-col w-full flex-grow p-4'>
              <div className='relative'>
                <Textarea
                  placeholder='Enter your question...'
                  rows={1}
                  ref={textareaRef}
                  onChange={handleInputChange}
                  value={message}
                  maxRows={4}
                  disabled={isAiThinking}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className='resize-none pr-12 text-base py-3 scrollbar-thumb-blue scrollbar-thumb-rounded scroll-track-blue-lighter scrollbar-w-2 scrolling-touch'
                  style={{
                    color: theme.primaryColor,
                    backgroundColor: theme.secondaryColor,
                    borderColor: theme.primaryColor,
                    borderRadius: '10px',
                    padding: '10px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <Button
                  disabled={isAiThinking}
                  className='absolute bottom-1.5 right-[8px]'
                  aria-label='send message'
                  onClick={handleSendMessage}
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: theme.secondaryColor,
                    borderRadius: '50%',
                    padding: '10px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <Send className='h-4 w-4' />
                </Button>
              </div>
              <div style={{ textAlign: 'center', marginTop: '10px', color: theme.primaryColor }}>
                Powered by Geneline-X
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurableChatbot;
