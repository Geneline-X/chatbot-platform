"use client"
import React, { useState } from 'react'
import FileUploadDropzone from './FileUploadDropzone';
import UploadProgressList from './UploadProgressList';
import TextTrainSession from './TextTrainSession';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Upload } from 'lucide-react';

interface MainUploadProps {
  isSubscribed: boolean;
}

const Main: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upload");

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Train Your Chatbot</h2>
      
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
              <FileUploadDropzone />
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
              <TextTrainSession />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Main