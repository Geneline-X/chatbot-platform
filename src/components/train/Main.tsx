"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import FileUploadDropzone from './FileUploadDropzone';
import UploadProgressList from './UploadProgressList';
import TextTrainSession from './TextTrainSession';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useChatbot } from '../business/BusinessContext';

interface MainProps {
  chatbotId: string;
}

const Main: React.FC<MainProps> = ({ chatbotId }) => {
  const [activeTab, setActiveTab] = useState("upload");
  const [isTraining, setIsTraining] = useState(false);

  const handleTrainingStatusChange = (trainingStatus: boolean) => {
    setIsTraining(trainingStatus);
  };

  const { currentChatbot } = useChatbot()
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Train Your Chatbot</h2>
        <Link href={`/chatbot-dashboard/chatbots/${currentChatbot?.id}`}>
          <Button 
            variant="secondary" 
            className="bg-blue-500 text-white hover:bg-blue-600"
            disabled={isTraining}
          >
            {isTraining ? 'Training in Progress...' : 'Test Your Bot'}
          </Button>
        </Link>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center justify-center">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center justify-center">
            <FileText className="w-4 h-4 mr-2" />
            Text Input
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Training Data</CardTitle>
              <CardDescription>Drag and drop files or click to select files for training.</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadDropzone onTrainingStatusChange={handleTrainingStatusChange} />
              <div className="mt-6">
                <UploadProgressList />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Text Training Session</CardTitle>
              <CardDescription>Enter text directly to train your chatbot.</CardDescription>
            </CardHeader>
            <CardContent>
              <TextTrainSession onTrainingStatusChange={handleTrainingStatusChange} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isTraining && (
        <div className="mt-6">
          <p className="text-blue-600 font-semibold">Training is in progress...</p>
        </div>
      )}

      {!isTraining && (
        <div className="mt-6">
          <p className="text-green-600 font-semibold">Ready for testing!</p>
        </div>
      )}
    </div>
  );
}

export default Main