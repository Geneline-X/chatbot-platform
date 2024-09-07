import { db } from "@/db";
import { model,llm } from "./gemini";
import { vectordb } from "./firebaseConfig";
import { collection, getDocs, addDoc, writeBatch, doc, getDoc,  query} from "firebase/firestore";

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
        return 'https://geneline-x-main-pipeline.vercel.app/chatbot-upload/image';
      case 'video':
        return 'https://geneline-x-main-pipeline.vercel.app/chatbot-upload/video';
      case 'audio':
        return 'https://geneline-x-main-pipeline.vercel.app/chatbot-upload/audio';
      case 'pdf':
        return 'https://geneline-x-main-pipeline.vercel.app/chatbot-upload/pdf';
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

// In-memory cache to store embeddings
const embeddingsCache: { [chatbotName: string]: { id: string, embedding: number[], pageText?: string, textUrl?:string }[] } = {};

// Timeouts for cache invalidation
const cacheTimeouts: { [chatbotName: string]: NodeJS.Timeout } = {};

// Function to retrieve embeddings from Firestore with caching and cache expiration
const getEmbeddingsFromFirestore = async (chatbotName: string) => {
  // Check if embeddings for the fileId are already in the cache
  console.log("get embeddings starts")
  if (embeddingsCache[chatbotName]) {
    console.log('Returning cached embeddings for fileId:', chatbotName);

    // Clear the existing timeout and set a new one to extend the cache expiration
    clearTimeout(cacheTimeouts[chatbotName]);
    cacheTimeouts[chatbotName] = setTimeout(() => {
      delete embeddingsCache[chatbotName];
      delete cacheTimeouts[chatbotName];
      console.log('Cache for fileId expired and removed:', chatbotName);
    }, 10 * 60 * 1000); // 10 minutes

    return embeddingsCache[chatbotName];
  }

  // If not in cache, retrieve from Firestore
  const q = query(collection(vectordb, chatbotName));
  const querySnapshot = await getDocs(q);
  const embeddings: { id: string, embedding: number[], pageText?:string, textUrl?: string }[] = [];
  querySnapshot.forEach((doc) => {
    embeddings.push({ id: doc.id, embedding: doc.data().embedding, pageText: doc.data().pageText });
  });

  // Store retrieved embeddings in the cache
  embeddingsCache[chatbotName] = embeddings;

  // Set a timeout to remove the cache after 10 minutes
  cacheTimeouts[chatbotName] = setTimeout(() => {
    delete embeddingsCache[chatbotName];
    delete cacheTimeouts[chatbotName];
    console.log('Cache for fileId expired and removed:', chatbotName);
  }, 10 * 60 * 1000); // 10 minutes


  return embeddings;
};

// Function to compute cosine similarity
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

// Function to find the top N similar embeddings
const findTopNSimilarEmbeddings = (queryEmbedding: number[], embeddings: { id: string, embedding: number[], pageText?: string, textUrl?: string }[], topN: number) => {
  const similarities = embeddings.map((embedding) => ({
    id: embedding.id,
    embedding: embedding.embedding,
    pageText: embedding.pageText,
    textUrl: embedding.textUrl,
    similarity: cosineSimilarity(queryEmbedding, embedding.embedding),
  }));
  
  //console.log("this is the top similarity: ", similarities)
  similarities.sort((a, b) => b.similarity - a.similarity);
  
  return similarities.slice(0, topN);
};

// Function to perform cosine similarity search
export const cosineSimilaritySearch = async ({message, chatbot, topN = 8}:any) => {
  try {
    const messageEmbedding = (await model.embedContent(message)).embedding.values;
    
    // Retrieve all embeddings from Firestore for the specified fileId
    const embeddings = await getEmbeddingsFromFirestore(chatbot.name);

    // Find the top N similar embeddings
    const topSimilarEmbeddings = findTopNSimilarEmbeddings(messageEmbedding, embeddings, topN);

    // Extract and join the individual numbers of the embeddings into a single string
    const joinedEmbeddings = topSimilarEmbeddings.map(e => e.embedding.slice(0,topN)).flat().join(' ');
    const contexts = topSimilarEmbeddings.map(e => e.pageText).join('\n\n');
    return contexts ? { joinedEmbeddings, contexts } : {joinedEmbeddings};

  } catch (error) {
    console.error('Error during cosine similarity search:', error);
    throw error;
  }
};

export const generateSystemInstruction = async(useOfChatbot: string | undefined):Promise<string | undefined> => {
  try {
    
    const result = await llm.generateContent(
      `Craft a concise and informative system instruction for the Gemini model to guide its responses in the following use case: 
      \n\n${useOfChatbot}.
      The instruction should be clear, specific, and aligned with the desired behavior.`
    );
    const response = result.response.text();
    console.log("this is the system instruction: ", response)
    return response
  } catch (error) {
    console.log(error)
  }
}