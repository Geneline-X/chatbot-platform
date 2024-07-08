"use client"
import React, { useState, useEffect } from 'react';
import { Progress } from '../ui/progress';
import { Loader2 } from 'lucide-react';
interface FileUpload {
  name: string;
  progress: number;
}

const UploadProgressList: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState<FileUpload[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUploadProgress((prev) => prev.map(file => ({
        ...file,
        progress: Math.min(file.progress + 10, 100)
      })));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4">
      {uploadProgress.map(file => (
        <div key={file.name} className='flex items-center justify-between mb-2'>
          <div className='flex items-center'>
            <Loader2 className='h-4 w-4 mr-2 animate-spin' />
            <span>{file.name}</span>
          </div>
          <Progress value={file.progress} className='w-1/2' />
        </div>
      ))}
    </div>
  );
}

export default UploadProgressList;
