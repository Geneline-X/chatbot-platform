"use client"
import React from 'react'
import FileUploadDropzone from './FileUploadDropzone';
import UploadProgressList from './UploadProgressList';
import TextTrainSession from './TextTrainSession';

interface MainUploadProps {
  isSubscribed: boolean;
}

interface Props {}

const Main = () => {

  return (
    <div className="p-4 bg-white shadow rounded">
        <h2 className="text-xl justify-center font-semibold mb-4">Upload Your Files</h2>
        <FileUploadDropzone />
        <TextTrainSession/>
        <UploadProgressList />
        
    </div>
   );
}

export default Main