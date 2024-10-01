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
  
  export const processingUrl = 'https://geneline-x-main-pipeline.vercel.app/chatbot-upload'

  // 'https://geneline-x-main-pipeline.vercel.app/chatbot-upload'

  export const getEndpointByFileType = (fileType: string): string => {
    switch (fileType) {
      case 'image':
        return  `${processingUrl}/image`
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

  type UploadTypes = {
    createdFile:any
    uploadStatus: "SUCCESS" | "FAILED"
}

type MakeRequestType = {
  endpoint: string,
  file: any,
  extension:string
  chatbotName:string | undefined
  chatbotId:  string | undefined, 
  userId:string | undefined
}
export const makeRequest = async({
  endpoint, 
  file, extension, 
  chatbotName, 
  chatbotId,
  userId
}: MakeRequestType)  => {
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
        chatbotName: chatbotName,
        chatbotId: chatbotId 
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
const embeddingsCache: { [chatbotId: string]: { id: string, embedding: number[], pageText?: string, textUrl?:string }[] } = {};

// Timeouts for cache invalidation
const cacheTimeouts: { [chatbotId: string]: NodeJS.Timeout } = {};

// Function to retrieve embeddings from Firestore with caching and cache expiration
const getEmbeddingsFromFirestore = async (chatbotId: string) => {
  // Check if embeddings for the fileId are already in the cache
  console.log("get embeddings starts")
  if (embeddingsCache[chatbotId]) {
    console.log('Returning cached embeddings for fileId:', chatbotId);

    // Clear the existing timeout and set a new one to extend the cache expiration
    clearTimeout(cacheTimeouts[chatbotId]);
    cacheTimeouts[chatbotId] = setTimeout(() => {
      delete embeddingsCache[chatbotId];
      delete cacheTimeouts[chatbotId];
      console.log('Cache for fileId expired and removed:', chatbotId);
    }, 10 * 60 * 1000); // 10 minutes

    return embeddingsCache[chatbotId];
  }

  // If not in cache, retrieve from Firestore
  const q = query(collection(vectordb, chatbotId));
  const querySnapshot = await getDocs(q);
  const embeddings: { id: string, embedding: number[], pageText?:string, textUrl?: string }[] = [];
  querySnapshot.forEach((doc) => {
    embeddings.push({ id: doc.id, embedding: doc.data().embedding, pageText: doc.data().pageText });
  });

  // Store retrieved embeddings in the cache
  embeddingsCache[chatbotId] = embeddings;

  // Set a timeout to remove the cache after 10 minutes
  cacheTimeouts[chatbotId] = setTimeout(() => {
    delete embeddingsCache[chatbotId];
    delete cacheTimeouts[chatbotId];
    console.log('Cache for fileId expired and removed:', chatbotId);
  }, 10 * 60 * 1000); // 10 minutes

//   const context = embeddings.map(embed => embed.pageText)
// console.log("this is the complete embedding: ", context)
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
    if(!chatbot.id){
      throw new Error("chatbot id empty please provide one: ")
    }
    const embeddings = await getEmbeddingsFromFirestore(chatbot?.id);

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

// In-memory cache to store context
const contextCache: { [key: string]: string } = {};

// Timeouts for cache invalidation
const contextCacheTimeouts: { [key: string]: NodeJS.Timeout } = {};
interface Chatbot {
  id: string;
  name: string;
}

export const getFullContextFromFirestore = async (chatbot: any) => {
  console.log("Getting full context for chatbot:", chatbot.id, chatbot.name);

  // Check if context is already in the cache (try both id and name)
  if (contextCache[chatbot.id] || contextCache[chatbot.name]) {
    const cacheKey = contextCache[chatbot.id] ? chatbot.id : chatbot.name;
    console.log('Returning cached context for:', cacheKey);

    // Clear the existing timeout and set a new one to extend the cache expiration
    clearTimeout(contextCacheTimeouts[cacheKey]);
    contextCacheTimeouts[cacheKey] = setTimeout(() => {
      delete contextCache[cacheKey];
      delete contextCacheTimeouts[cacheKey];
      console.log('Cache for chatbot context expired and removed:', cacheKey);
    }, 10 * 60 * 1000); // 10 minutes
    
    return contextCache[cacheKey];
  }

  let fullContext = '';

  // Try to retrieve context using the ID first
  let q = query(collection(vectordb, chatbot.id));
  let querySnapshot = await getDocs(q);

  // If no results found with ID, try using the name
  if (querySnapshot.empty) {
    console.log('No results found for ID, trying with name');
    q = query(collection(vectordb, chatbot.name));
    querySnapshot = await getDocs(q);
  }

  querySnapshot.forEach((doc) => {
    const pageText = doc.data().pageText;
    if (pageText) {
      fullContext += pageText + '\n\n';
    }
  });

  // If still no results, log an error
  if (fullContext === '') {
    console.error('No context found for chatbot:', chatbot.id, chatbot.name);
    return '';
  }

  // Store retrieved context in the cache (use ID for new cache entries)
  contextCache[chatbot.id] = fullContext.trim();

  // Set a timeout to remove the cache after 10 minutes
  contextCacheTimeouts[chatbot.id] = setTimeout(() => {
    delete contextCache[chatbot.id];
    delete contextCacheTimeouts[chatbot.id];
    console.log('Cache for chatbot context expired and removed:', chatbot.id);
  }, 10 * 60 * 1000); // 10 minutes

  console.log(`Retrieved context for ${chatbot.id}. Length: ${fullContext.length} characters`);
  console.log(`First 500 characters: ${fullContext.substring(0, 500)}...`);
  return fullContext.trim();
};