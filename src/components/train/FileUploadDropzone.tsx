"use client"

import React, { useState, useCallback } from 'react';
import DropZone, { DropzoneState } from "react-dropzone";
import { Cloud, Loader2 } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { Progress } from '../ui/progress';
import { useBusiness, useChatbot } from '../business/BusinessContext';
import { useFileHelpers } from '@/lib/hooks/useFileHelpers';

interface FileUploadDropzoneProps {
  isSubscribed?: boolean;
}

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({ isSubscribed }) => {
  const { currentChatbot } = useChatbot()
  const { currentBusiness } = useBusiness()

  const router = useRouter()
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [isUploading, setIsUploading] = useState(false);

  const { getFileType, getEndpointByFileType, makeRequest } = useFileHelpers();

  
  const { startUpload } = useUploadThing(false ? 'proPlanUploader' : 'freePlanUploader', {
    onClientUploadComplete: async(res) => {
      await Promise.all(res.map(async (file) => {
        const { extension, name } = getFileType(file.name)
        console.log(extension)
        const endpoint = getEndpointByFileType(name)
        console.log(endpoint)
        await makeRequest({
          endpoint,
          file,
          extension,
          chatbotName: currentChatbot?.name,
          userId: currentBusiness?.userId
        });
      }));
    },
    onUploadError: (error) => {
      console.log("error occured: ",error)
    }
  });

  const startSimulatedProgress = () => {
      setUploadProgress(0)

      const interval = setInterval(() => {
          setUploadProgress((prevProgress) => {
            if(prevProgress >= 95){
                clearInterval(interval)
                return prevProgress
            }
            return prevProgress + 5
          })
      }, 500)
      return interval
  }

  const handleUploadResponse = (res: any) => {
    if (!res) {
        toast({
            title: "Something went wrong",
            description: "Please try again later.",
            variant: "destructive"
        });
    } else {
        const [fileResponse] = res || [];
        const key = fileResponse?.key;
        if (key) {
            setUploadProgress(100);
           // startPolling({ key });
        } else {
            toast({
                title: "Something went wrong",
                description: "Please try again later.",
                variant: "destructive"
            });
        }
    }
};  
 
  const handleFileUpload = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    const progressInterval = startSimulatedProgress();
    try {
      const res = await startUpload(acceptedFiles);
      console.log(res)
      // Handle response
      handleUploadResponse(res)
      toast({ title: 'Upload Successful!', description: 'Your files have been uploaded.' });
    } catch (error) {
      toast({ title: 'Upload Failed', description: 'An error occurred during the upload.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      clearInterval(progressInterval);
    }
  }, [startUpload]);

  return (
    <DropZone multiple onDrop={handleFileUpload}>
      {({ getRootProps, getInputProps }: DropzoneState) => (
        <div {...getRootProps()} className='border h-64 m-4 border-dashed border-gray-300 rounded-lg'>
          <div className="flex items-center justify-center h-full w-full">
            <label htmlFor="dropzone-file" className='flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100'>
              <Cloud className='h-6 w-6 text-zinc-500 mb-2' />
              <p className='mb-2 text-sm text-zinc-700'>
                <span className='font-semibold'>Click to upload</span> or drag and drop
              </p>
              <p className='text-sm text-zinc-500'>Document Files/Media Files</p>

              {isUploading ? (
                <div className='w-full mt-4 max-w-xs mx-auto'>
                  <Progress 
                  value={uploadProgress} 
                  className='h-1 w-full bg-zinc-200'
                  indicatorColor={
                    uploadProgress === 100 ? "bg-green-500": ""
                  }
                  />
                  {uploadProgress === 100 ? (
                    <div className='flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2'>
                        <Loader2 className='h-3 w-3 animate-spin'/>
                        Redirecting...
                    </div>
                  ): null}
                </div>
                ): null}
              <input {...getInputProps()} type="file" id='dropzone-file' className='hidden' />
            </label>
          </div>
        </div>
      )}
    </DropZone>
  );
};

export default FileUploadDropzone;
