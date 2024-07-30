import { db } from "@/db";
import { SendMessageValidators } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest } from "next/server";
import { StreamingTextResponse } from "ai"
import { ReadableStream } from "web-streams-polyfill/ponyfill";
import { llm,genAI } from "@/lib/gemini";
import { cosineSimilaritySearch, generateSystemInstruction } from "@/lib/elegance";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { Prisma } from "@prisma/client";
export const maxDuration = 300


export const POST = async(req: NextRequest) => {
    try {
        
        const body = await req.json()
        const { getUser } = getKindeServerSession()
        const user = await  getUser()
    
        const userId = user?.id
    
        if(!userId) return new Response("Unauthorized", {status: 401})

          console.log("this is the body: ", body)
        const { chatbotId ,message, isUrlFile } = SendMessageValidators.parse(body)

        const prevMessages = await db.message.findMany({
            where: {
                chatbotId
            },
            orderBy:{
                createAt: "asc"
            },
            take: 6
        })
    
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
                userId,
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
           
          const chatConfigObject = {
            maxOutputTokens: config?.maxOutputTokens as number || 2040,
            candidateCount: config?.responseCandidates as number,
            stopSequences: config?.stopSequence as string[],
            temperature: config?.temperature as number,
            topK: config?.topK as number,
            topP: config?.topP as number
          }
 
          const systemInstructionFromAI = await generateSystemInstruction(chatbot?.systemInstruction as string)
         console.log(chatbot?.systemInstruction)
         console.log(systemInstructionFromAI)
          const llm = genAI.getGenerativeModel({
            model:"gemini-1.5-flash",
            systemInstruction: systemInstructionFromAI
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
                generationConfig: chatConfigObject
            });
        }
        const pageText = ''
        // find a context //
        const msg = `${message} ${contexts}`;
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
                  // If previous database call exists, update the existing message
                  const streamMessage = await db.message.create({
                    data: {
                      text,
                      isUserMessage: false,
                      chatbotId,
                      fileId:'',
                      userId,
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
