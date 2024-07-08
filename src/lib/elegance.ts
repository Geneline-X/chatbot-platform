import { db } from "@/db";

export const getFileType = (fileName: string): {extension:string, name:string} => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
        return {extension:"jpeg", name: 'image'};
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'heic':
      case 'heif':
        return {extension, name: 'image'};
      case 'mp4':
      case 'avi':
      case 'mkv':
      case 'mov':
        return {extension, name: 'video'};
      case 'mp3':
      case 'wav':
      case 'aac':
      case 'flac':
      case 'ogg':
      case 'm4a':
        return {extension, name: 'audio'};
      case 'pdf':
        return {extension, name: 'pdf'};
      default:
        throw new Error('Unsupported file type');
    }
  };
  
  
  export const getEndpointByFileType = (fileType: string): string => {
    switch (fileType) {
      case 'image':
        return 'http://localhost:3800/chatbot-upload/image';
      case 'video':
        return 'http://localhost:3800/chatbot-upload/video';
      case 'audio':
        return 'http://localhost:3800/chatbot-upload/audio';
      case 'pdf':
        return 'http://localhost:3800/chatbot-upload/pdf';
      default:
        throw new Error('Unsupported file type');
    }
  };

  type UploadTypes = {
    createdFile:any
    uploadStatus: "SUCCESS" | "FAILED"
}

type MakeRequestType = {
  endpoint: string,
  file: any,
  extension:string
  chatbotName:string | undefined
  userId:string | undefined
}
export const makeRequest = async({endpoint, file, extension, chatbotName, userId}: MakeRequestType) => {
  try {
    // const isFileExists = await db.file.findFirst({ where: { key: file.key } });
    // if (isFileExists) return;

    // const createdFile = await db.file.create({
    //   data: {
    //     key: file.key,
    //     name: file.name,
    //     userId: userId,
    //     url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
    //     uploadStatus: "PROCESSING",
    //   },
    // });

    // console.log(createdFile)

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        createdFile: file,
        mimeType: extension,
        chatbotName: chatbotName 
      }),
    });

    if (response.ok) {
      await updateStatusInDb({ uploadStatus: "SUCCESS", createdFile: file });
    } else {
      throw new Error("Failed to process file");
    }

    const data = await response.json();
    console.log("Data from cloud functions:", data);

  } catch (error) {
    console.log(error)
  }
}
export const updateStatusInDb = async({uploadStatus, createdFile}: UploadTypes) => {
   try {
        await db.file.update({
            data: {
            uploadStatus: uploadStatus
            },
            where: {
            id: createdFile.id,
            }
        })
   } catch (error) {
      console.log(error)
   }
}