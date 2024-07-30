""
import React from 'react';
import ChatMessageStandalone from './ChatMessageStandalone';
import { Loader2 } from 'lucide-react';

interface ChatMessagesStandaloneProps {
    messages: any[];
    theme: any;
    isLoading: boolean;
}

const ChatMessagesStandalone: React.FC<ChatMessagesStandaloneProps> = ({ messages, theme, isLoading }) => {
    return (
        <div className={`p-4 overflow-y-auto ${theme.secondaryColor}`}>
          {messages.map((msg) => (
            <ChatMessageStandalone key={msg.id} text={msg.text} isUser={msg.isUserMessage} theme={theme} isLoading={false} />
          ))}
          {isLoading && (
            <ChatMessageStandalone
              key="loading"
              text={
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  <span>Thinking...</span>
                </div>
              }
              isUser={false}
              theme={theme}
              isLoading={true}
            />
          )}
        </div>
      );
    
}

export default ChatMessagesStandalone