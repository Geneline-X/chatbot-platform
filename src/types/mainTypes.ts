// Types for Chatbot
export interface Chatbot {
    id: string;
    name: string;
    businessId: string;
    systemInstruction: string;
    urlsToBusinessWebsite: string;
    customConfigurations: Record<string, any>;
  }
  
  // Types for Message
  export interface Message {
    id: string;
    chatbotId: string;
    content: string;
  }
  
  // Types for File
  export interface File {
    id: string;
    chatbotId: string;
    name: string;
    url: string;
  }
  
  // Props for ChatbotsList Component
  export interface ChatbotsListProps {
    onSelect: (chatbot: Chatbot) => void;
  }
  
  // Props for ChatbotForm Component
  export interface ChatbotFormProps {
    onSave: () => void;
    onCancel: () => void;
  }
  
  // Props for ChatbotDetails Component
  export interface ChatbotDetailsProps {
    chatbot: Chatbot;
    onBack: () => void;
  }
  
  // Props for MessagesList Component
  export interface MessagesListProps {
    chatbotId: string;
  }
  
  // Props for FilesList Component
  export interface FilesListProps {
    chatbotId: string;
  }
  
  // Props for Configurations Component
  export interface ConfigurationsProps {
    configurations: Record<string, any>;
  }
  