"use client";

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import axios from 'axios';

interface ExportModalProps {
  onClose: () => void;
  embedCode: string;
  chatbotId: string;
}

const ExportChatbotModal: React.FC<ExportModalProps> = ({ onClose, embedCode, chatbotId }) => {
  const [activeTab, setActiveTab] = useState('npm');
  const [isDeploying, setIsDeploying] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);

  const installCode = {
    npm: `npm install @denno1000/genistudio-package`,
    yarn: `yarn add @denno1000/genistudio-package`
  };

  const usageCode = `
import React from 'react';
import { ConfigurableChatbot } from '@denno1000/genistudio-package';

const App = () => {
  return (
    <div>
      <h1>Welcome to Our Platform</h1>
      <ConfigurableChatbot chatbotId="${chatbotId}" />
    </div>
  );
};

export default App;
`;

  const handleCopyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: message,
      });
    });
  };

  const handleDeployToWhatsApp = async () => {
    setIsDeploying(true);
    try {
      const response = await axios.post('/api/whatsapp-deploy', { chatbotId });
      
      if (response.data.success) {
        setWhatsappNumber(response.data.phoneNumber);
        toast({
          title: "WhatsApp Deployment Successful",
          description: `Your chatbot is now available on WhatsApp at ${response.data.phoneNumber}`,
        });
      } else {
        throw new Error(response.data.error || 'Deployment failed');
      }
    } catch (error) {
      console.error('Error deploying to WhatsApp:', error);
      toast({
        title: "WhatsApp Deployment Failed",
        description: "There was an error deploying your chatbot to WhatsApp. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Export Chatbot</h2>
        
        <Tabs defaultValue="install" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="install">Installation</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="embed">Link</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>
          
          <TabsContent value="install">
            <h3 className="text-lg font-semibold mb-2">Install the package</h3>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="npm">npm</TabsTrigger>
                <TabsTrigger value="yarn">yarn</TabsTrigger>
              </TabsList>
            </Tabs>
            <Textarea
              readOnly
              value={installCode[activeTab as keyof typeof installCode]}
              className="border p-2 mt-2 w-full h-12 bg-gray-800 text-green-500 font-mono text-sm"
            />
            <Button onClick={() => handleCopyToClipboard(installCode[activeTab as keyof typeof installCode], "Install command copied!")} className="bg-blue-500 text-white p-2 mt-2">
              Copy Install Command
            </Button>
          </TabsContent>
          
          <TabsContent value="usage">
            <h3 className="text-lg font-semibold mb-2">Use the component</h3>
            <Textarea
              readOnly
              value={usageCode}
              className="border p-2 mt-2 w-full h-48 bg-gray-800 text-green-500 font-mono text-sm"
            />
            <Button onClick={() => handleCopyToClipboard(usageCode, "Usage code copied!")} className="bg-blue-500 text-white p-2 mt-2">
              Copy Usage Code
            </Button>
          </TabsContent>
          
          <TabsContent value="embed">
            <h3 className="text-lg font-semibold mb-2">Embed code</h3>
            <Textarea
              readOnly
              value={embedCode}
              className="border p-2 mt-2 w-full h-48 bg-gray-800 text-green-500 font-mono text-sm"
            />
            <Button onClick={() => handleCopyToClipboard(embedCode, "Embed code copied!")} className="bg-blue-500 text-white p-2 mt-2">
              Copy Link
            </Button>
          </TabsContent>
          
          <TabsContent value="whatsapp">
            <h3 className="text-lg font-semibold mb-2">Deploy to WhatsApp</h3>
            {whatsappNumber ? (
              <div>
                <p>Your chatbot is available on WhatsApp at:</p>
                <p className="font-bold text-lg">{whatsappNumber}</p>
              </div>
            ) : null 
            // (
            //   <Button 
            //     onClick={handleDeployToWhatsApp} 
            //     disabled={isDeploying}
            //     className="bg-green-500 text-white p-2 mt-2"
            //   >
            //     {isDeploying ? 'Deploying...' : 'Deploy to WhatsApp'}
            //   </Button>
            // )
            }
          </TabsContent>
        </Tabs>
        
        <Button 
          onClick={onClose} 
          variant="outline"
          className="mt-6 w-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 ease-in-out"
        >
          Close
        </Button>
      </div>
    </div>
  );
}

export default ExportChatbotModal;
