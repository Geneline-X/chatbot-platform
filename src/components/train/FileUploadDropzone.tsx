"use client"

import React, { useState, useCallback } from 'react';
import DropZone, { DropzoneState } from "react-dropzone";
import { Cloud, Loader2, File } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { Progress } from '../ui/progress';
import { useBusiness, useChatbot } from '../business/BusinessContext';
import { useFileHelpers } from '@/lib/hooks/useFileHelpers';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
interface FileUploadDropzoneProps {
  isSubscribed?: boolean;
}

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({ isSubscribed }) => {
  const { currentChatbot } = useChatbot()
  const { currentBusiness } = useBusiness()

  const router = useRouter()
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { getFileType, getEndpointByFileType, makeRequest } = useFileHelpers();

  const { startUpload } = useUploadThing(isSubscribed ? 'proPlanUploader' : 'freePlanUploader', {
    onClientUploadComplete: async(res) => {
      await Promise.all(res.map(async (file) => {
        const { extension, name } = getFileType(file.name)
        const endpoint = getEndpointByFileType(name)
        await makeRequest({
          endpoint,
          file,
          extension,
          chatbotName: currentChatbot?.name,
          userId: currentBusiness?.userId
        });
      }));
      setIsUploading(false);
      setUploadProgress(100);
      toast({ title: 'Upload Successful!', description: 'Your files have been uploaded and processed.' });
    },
    onUploadError: (error) => {
      setIsUploading(false);
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
    }
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    setUploadedFiles(acceptedFiles);
    setUploadProgress(0);
    try {
      startUpload(acceptedFiles);
      simulateProgress();
    } catch (error) {
      console.error('Error uploading files:', error);
      setIsUploading(false);
      toast({ title: 'Upload Failed', description: 'An error occurred during the upload.', variant: 'destructive' });
    }
  }, [startUpload]);

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 95) {
        clearInterval(interval);
        progress = 95;
      }
      setUploadProgress(progress);
    }, 500);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  return (
    <div 
      {...getRootProps()} 
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 transition-all duration-300 ease-in-out hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center">
        <AnimatePresence>
          {isDragActive ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-blue-500"
            >
              <Cloud className="h-16 w-16 mb-4" />
              <p className="text-xl font-semibold">Drop files here</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Cloud className="h-16 w-16 mb-4 text-gray-400" />
              <p className="text-xl font-semibold mb-2">Drag & Drop files here</p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <button 
                onClick={() => document.querySelector('input')?.click()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
              >
                Select Files
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isUploading && (
          <div className="mt-8 w-full">
            <Progress value={uploadProgress} className="h-2 w-full bg-gray-200" indicatorColor="bg-blue-500" />
            <p className="text-sm text-gray-500 mt-2">Uploading... {uploadProgress.toFixed(0)}%</p>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-8 w-full">
            <h3 className="text-lg font-semibold mb-2">Uploaded Files:</h3>
            <ul className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <File className="h-4 w-4 mr-2" />
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadDropzone;
