import { useState } from 'react';


  // 'https://geneline-x-main-pipeline.vercel.app/chatbot-upload'

export const useFileHelpers = () => {
  const processingUrl = 'https://geneline-x-main-pipeline.vercel.app/chatbot-upload'

  const getFileType = (fileName: string): { extension: string; name: string } => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
        return { extension: 'jpeg', name: 'image' };
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'heic':
      case 'heif':
        return { extension, name: 'image' };
      case 'mp4':
      case 'avi':
      case 'mkv':
      case 'mov':
        return { extension, name: 'video' };
      case 'mp3':
      case 'wav':
      case 'aac':
      case 'flac':
      case 'ogg':
      case 'm4a':
        return { extension, name: 'audio' };
      case 'pdf':
        return { extension, name: 'pdf' };
      default:
        throw new Error('Unsupported file type');
    }
  };

  const getEndpointByFileType = (fileType: string): string => {
    switch (fileType) {
      case 'image':
        return `${processingUrl}/image`;
      case 'video':
        return `${processingUrl}/video`;
      case 'audio':
        return `${processingUrl}/audio`;
      case 'pdf':
        return `${processingUrl}/pdf`;
      default:
        throw new Error('Unsupported file type');
    }
  };

  const makeRequest = async ({
    endpoint,
    file,
    extension,
    chatbotName,
    chatbotId
  }: {
    endpoint: string;
    file: any;
    extension: string;
    chatbotName: string | undefined;
    chatbotId: string | undefined;
    userId: string | undefined;
  }) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          createdFile: file,
          mimeType: extension,
          chatbotName: chatbotName,
          chatbotId: chatbotId
        }),
      });

      if (response.ok) {
        await updateStatusInDb({ uploadStatus: 'SUCCESS', createdFile: file });
      } else {
        throw new Error('Failed to process file');
      }

      const data = await response.json();
      console.log('Data from cloud functions:', data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatusInDb = async ({
    uploadStatus,
    createdFile,
  }: {
    uploadStatus: 'SUCCESS' | 'FAILED';
    createdFile: any;
  }) => {
    try {
      // Update the status in your database
      console.log(`Update status to ${uploadStatus} for file`, createdFile);
    } catch (error) {
      console.log(error);
    }
  };

  return { getFileType, getEndpointByFileType, makeRequest, updateStatusInDb, processingUrl };
};
