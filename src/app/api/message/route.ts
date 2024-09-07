import { db } from "@/db";
import { SendMessageValidators } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { StreamingTextResponse } from "ai"
import { ReadableStream } from "web-streams-polyfill/ponyfill";
import { llm,genAI } from "@/lib/gemini";
import { cosineSimilaritySearch, getFullContextFromFirestore } from "@/lib/elegance";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Prisma } from "@prisma/client";
import { storeInMemoryMessage, getInMemoryMessages } from "@/lib/utils";
import { TRPCError } from "@trpc/server";

export const maxDuration = 300
 const extractionInstruction = `
You are an assistant whose job is to extract relevant information from the provided context and use it to answer the user's query. 
Always refer to the context and prioritize information from it when generating your response.
If no relevant information is found, let the user know and avoid providing unrelated information.
`;

export const POST = async(req: NextRequest) => {
    try {
        
        const body = await req.json()
     
          console.log("this is the body: ", body)
        const { chatbotId ,message, email, sessionId } = SendMessageValidators.parse(body)

        let chatbotUser = null;
        if(!email){
          throw new TRPCError({message: "email not found", code: "NOT_FOUND"})
            
         }
        if (email) {
            chatbotUser = await db.chatbotUser.upsert({
                where: { email },
                update: { updatedAt: new Date() },
                create: { email, chatbotId },
            });
        }

        const prevMessages = email ? await db.message.findMany({
            where: {
              chatbotUserId: chatbotUser?.id,
                chatbotId,
                
            },
            orderBy:{
                createAt: "asc"
            },
            take: 6
        }) : getInMemoryMessages(sessionId!)
    
         
         const formattedPrevMessages = prevMessages.map((msg:any) => {
            return {
              role: msg.isUserMessage ? "user" : "model",
              parts: msg.text,
            };
          });

          let createMessage = await db.message.create({
            data: {
                text: message,
                isUserMessage: true,
                chatbotUserId: chatbotUser?.id,
                chatbotId,
             }
          })

          console.log("This is the created Message: ", createMessage)
          const chatbot = await db.chatbot.findFirst({
            where: { id: chatbotId },
            include: {
              file: true,
              message: true,
              brands: true,
              urlFiles: true,
            },
          });
          
          const { contexts } = await cosineSimilaritySearch({message, chatbot})
    
          const config = chatbot?.customConfigurations as Prisma.JsonObject
          //  console.log('this is the context of the: ',contexts)
          const chatConfigObject = {
            maxOutputTokens: config?.maxOutputTokens as number || 2040,
            candidateCount: config?.responseCandidates as number,
            stopSequences: config?.stopSequence as string[],
            temperature: config?.temperature as number,
            topK: config?.topK as number,
            topP: config?.topP as number
          }
 
          
          const llm = genAI.getGenerativeModel({
            model:"gemini-1.5-flash",
            systemInstruction: chatbot?.systemInstruction!
           })
        
        
          let chat: any;
        ///// start the model chatting ////
         if(formattedPrevMessages.length === 0 || formattedPrevMessages[formattedPrevMessages.length - 1].role === "user"){
            chat = llm.startChat({
                  generationConfig: chatConfigObject,
              });
          }else{
              chat = llm.startChat({
               // chathistory should be here
              //  history: formattedPrevMessages,
                generationConfig: chatConfigObject
            });
        }
        const pageText = ''
        // find a context //
        const msg = `${extractionInstruction}\n\nUser Query: ${message}\n\nContext:\n${contexts}`;

        // send the stream to the frontend automatically //
        const resultFromChat = await chat.sendMessageStream(msg);
        let text = ''
        const responseStream = new ReadableStream({
          async start(controller) {
            try {
                  for await(const chunk of resultFromChat.stream) {
                    controller.enqueue(chunk.text());
                    text += chunk.text() 
                  }
                  
                  const streamMessage = await db.message.create({
                    data: {
                      text,
                      isUserMessage: false,
                      chatbotId,
                      chatbotUserId: chatbotUser?.id,
                      fileId:'',  
                    },
                  });
                  console.log("This is the created Stream Message: ", streamMessage)
                  console.log("this is the response: ", text)
                  controller.close();
              } catch (error) {
              // Handle errors
              console.error("Error enqueuing chunks:", error);
              await db.message.delete({ where: { id: createMessage?.id } });
              controller.error(error);
            }
          }
        })

       return  new StreamingTextResponse(responseStream);
       
    } catch (error) {
      console.log(error)
    
      return new Response(JSON.stringify({message: error}), {status: 500})
    }
}
