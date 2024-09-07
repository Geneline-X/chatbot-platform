import { db } from '@/db';
import { PrivateProcedure, publicProcedure, router } from './trpc';
 import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { TRPCError } from "@trpc/server"
import { z } from 'zod';
import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
//import { absoluteUrl, setMainMonimeSessionData } from '@/lib/utils';
//import { getUserSubscriptionPlan, } from '@/lib/monime';
//import { getStripeUserSubscriptionPlan, stripe } from '@/lib/stripe';
//import { PLANS } from '@/config/stripe';
import { v4 } from 'uuid'
import { getInMemoryMessages } from '@/lib/utils';
import { generateSystemInstruction } from '@/lib/elegance';

export const appRouter = router({
    authCallback: publicProcedure.query(async() => {
        const { getUser } = getKindeServerSession()
        const user = await getUser()
        if(!user?.id || !user?.email){
            throw new TRPCError({code: "UNAUTHORIZED"})
        }
        // Check in the database
        const dbUser = await db.user.findFirst({
            where: {id: user.id}
        })
        if(!dbUser){
            //// create user in db
            await db.user.create({
                data: {
                    id: user.id,
                    email: user.email, 
                }
            })
        }
        return { success: true}
      }),

 createChatbot: PrivateProcedure.input(z.object({
    businessId: z.string(),
    name: z.string(),
    systemInstruction: z.string().optional(),
    urlsToBusinessWebsite: z.string().optional(),
    customConfigurations: z.any().optional(),
   })).mutation(async({input}) => {

     const { businessId, name, systemInstruction, urlsToBusinessWebsite, customConfigurations } = input;

     const systemInstructionAI = await generateSystemInstruction(systemInstruction)
     const newChatbot = await db.chatbot.create({
        data: {
          businessId,
          name,
          systemInstruction: systemInstructionAI,
          urlsToBusinessWebsite,
          customConfigurations,
        },
      });

      return newChatbot;
   }),
   getChatbot: PrivateProcedure.input(z.object({
    chatbotId: z.string()
   })).query(async({ctx, input}) => {

    const { chatbotId } = input;

    const chatbot = await db.chatbot.findFirst({
      where: { id: chatbotId },
      include: {
        file: true,
        message: true,
        brands: true,
        urlFiles: true,
      },
    });

    return chatbot;
   }),

   getAllChatbots: PrivateProcedure.input(z.object({
    businessId: z.string()
   })).mutation(async({ctx, input}) => {

    const { businessId } = input;

    const chatbots = await db.chatbot.findMany({
      where: { businessId },
      include: {
        file: true,
        message: true,
        brands: true,
        urlFiles: true,
      },
    });

    return chatbots;
   }),

   getChatbotFiles: PrivateProcedure.input(z.object({
    chatbotId: z.string(),
  })).query(async ({ input }) => {
    const { chatbotId } = input;

    return await db.file.findMany({
      where: {
        chatbotId,
      },
      include: {
        _count: {
          select: {
            message: true,
          },
        },
      },
    });
  }),
   getChatbotMessages: publicProcedure.input(z.object({
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
    chatbotId: z.string().optional(),
    email: z.string().optional(),
    sessionId: z.string().optional().nullish(),
  })).query(async ({ input }) => {
    const { chatbotId, cursor, email } = input;
    const limit = input.limit ?? 20;

    if (email) {
      // Fetch messages associated with the user's email
      const messages = await db.message.findMany({
        where: {
          chatbotId,
          chatbotUser: {
            email: email,
          },
        },
        orderBy: {
          createAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: limit + 1,
        select: {
          id: true,
          isUserMessage: true,
          chatbotId: true,
          createAt: true,
          text: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor
      };
    }  else {
      // Return empty result if neither email nor sessionId is provided
      return {
        messages: [],
        nextCursor: undefined,
      };
    }
  }),

  getChatbotInMemoryMessages: publicProcedure.input(z.object({
    sessionId: z.string(),
    limit: z.number().min(1).max(100).nullish(),
    cursor: z.string().nullish(),
  })).query(async ({ input }) => {
    const { sessionId, cursor } = input;
    const limit = input.limit ?? 20;

    const messages = getInMemoryMessages(sessionId).slice();
    const startIndex = cursor ? messages.findIndex(msg => msg.id === cursor) + 1 : 0;
    const paginatedMessages = messages.slice(startIndex, startIndex + limit);

    const nextCursor = paginatedMessages.length < messages.length ? paginatedMessages[paginatedMessages.length - 1].id : undefined;

    return {
      messages: paginatedMessages,
      nextCursor,
    };
  }),

   updateChatbot: PrivateProcedure.input(z.object({
    id: z.string(),
    name: z.string().optional(),
    systemInstruction: z.string().optional(),
    urlsToBusinessWebsite: z.string().optional(),
    customConfigurations: z.any().optional(),

   })).mutation(async({input}) => {
    const { id, name, systemInstruction, urlsToBusinessWebsite, customConfigurations } = input;

    // Efficiently construct the update data by filtering out undefined values
    const systemInstructionAI = await generateSystemInstruction(systemInstruction)
      const updateData = {
        ...(name && { name }),
        ...(systemInstruction && { systemInstruction: systemInstructionAI }),
        ...(urlsToBusinessWebsite && { urlsToBusinessWebsite }),
        ...(customConfigurations && { customConfigurations }),
      };

      const updatedChatbot = await db.chatbot.update({
        where: { id },
        data: updateData,
      });

      return updatedChatbot;
   }),

   deleteChatbot: PrivateProcedure.input(z.object({
    id: z.string()
  })).mutation(async ({ input }) => {
    const { id } = input;
  
    console.log('this is the id: ', id);
    
    // Find the chatbot
    const chatbot = await db.chatbot.findFirst({
      where: { id }
    });
    
    if (!chatbot) {
      throw new Error("Chatbot not found");
    }
  
    // Check if a brand is associated with the chatbot
    const brand = await db.brand.findFirst({
      where: {
        chatbotId: chatbot.id
      }
    });
  
    // Delete the associated brand if it exists
    if (brand) {
      await db.brand.delete({
        where: {
          id: brand.id
        }
      });
    }
  
    // Now delete the chatbot
    await db.chatbot.delete({
      where: { id }
    });
  
    console.log('Chatbot and associated brand deleted successfully');
    
    return { success: true };
  }),
  

   createBusiness: PrivateProcedure.input(z.object({
    name: z.string(),
    description: z.string().optional(),
    industry: z.string().optional()
   })).mutation(async({ctx, input}) => {
    const { userId } = ctx
    const { name, description, industry } = input;

    const newBusiness = await db.business.create({
      data: {
        userId,
        name,
        description,
        industry
      },
    });

    return newBusiness;
   }),

   getAllBusinesses: PrivateProcedure.query(async ({ctx}) => {
    const { userId } = ctx
    const businesses = await db.business.findMany({
        where: { userId },
        include: {
          chatbots: {
            include: {
              message: true,
              file: true,
              brands: true,
            },
          },
        },
      });
  
      return businesses;
   }),

   updateBusiness: PrivateProcedure.input(z.object({
    id: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    industry: z.string().optional()
  })).mutation(async({input}) => {
    const { id, name, description, industry } = input;

    const updatedBusiness = await db.business.update({
      where: { id },
      data: {
        name,
        description,
        industry,
      },
    });

    return updatedBusiness;
  }),

  deleteBusiness: PrivateProcedure.input(z.object({
    id: z.string()
  })).mutation(async({input}) => {

    const { id } = input;
    await db.business.delete({
      where: { id },
    });

    return { success: true };
  }),

  createBrand: PrivateProcedure.input(z.object({
    chatbotId: z.string(),
    name: z.string(),
    logo: z.string().optional(),
    theme: z.any().optional(),
    brandId: z.string().optional()
  })).mutation(async({input}) => {

    const { chatbotId, name, logo, theme, brandId } = input;

    if(brandId){
      const newBrand = await db.brand.update({
        where: {id: brandId},
        data: {
          chatbotId,
          name,
          logo,
          theme,
        },
      });

      return newBrand
    }else{
      const newBrand = await db.brand.create({
        data: {
          chatbotId,
          name,
          logo,
          theme,
        },
      });
  
      return newBrand;
    }
    
  }),
  getBrand: publicProcedure.input(z.object({
   chatbotId: z.string()
  })).query(async({ctx, input}) => {
    const { chatbotId } = input

    const brand = await db.brand.findFirst({
      where: { chatbotId }
    })

    return brand
  }),

  getAllBrands: PrivateProcedure.input(z.object({
    chatbotId: z.string()
  })).mutation(async({input}) => {
    const { chatbotId } = input;

    const brands = await db.brand.findMany({
    where: { chatbotId },
    });
    return brands;
  }),

  updateBrands: PrivateProcedure.input(z.object({
    id: z.string(),
    name: z.string().optional(),
    logo: z.string().optional(),
    theme: z.any().optional(),
  })).mutation(async({input}) => {
    const { id, name, logo, theme } = input;

    const updatedBrand = await db.brand.update({
      where: { id },
      data: {
        name,
        logo,
        theme,
      },
    });

    return updatedBrand;
  }),

  deleteBrand: PrivateProcedure.input(z.object({
    id:z.string()
  })).mutation(async ({input}) => {
    const { id } = input;

    await db.brand.delete({
      where: { id },
    });

    return { success: true };
  }),
})

export type AppRouter = typeof appRouter;