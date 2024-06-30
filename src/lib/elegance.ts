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
        return 'http://localhost:3800/file-upload/image';
      case 'video':
        return 'http://localhost:3800/file-upload/video';
      case 'audio':
        return 'http://localhost:3800/file-upload/audio';
      case 'pdf':
        return 'http://localhost:3800/file-upload/pdf';
      default:
        throw new Error('Unsupported file type');
    }
  };

  type UploadTypes = {
    createdFile:any
    uploadStatus: "SUCCESS" | "FAILED"
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