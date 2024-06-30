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

     const newChatbot = await db.chatbot.create({
        data: {
          businessId,
          name,
          systemInstruction,
          urlsToBusinessWebsite,
          customConfigurations,
        },
      });

      return newChatbot;
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
   updateChatbot: PrivateProcedure.input(z.object({
    id: z.string(),
    name: z.string().optional(),
    systemInstruction: z.string().optional(),
    urlsToBusinessWebsite: z.string().optional(),
    customConfigurations: z.any().optional(),

   })).mutation(async({input}) => {
    const { id, name, systemInstruction, urlsToBusinessWebsite, customConfigurations } = input;

    const updatedChatbot = await db.chatbot.update({
      where: { id },
      data: {
        name,
        systemInstruction,
        urlsToBusinessWebsite,
        customConfigurations,
      },
    });

    return updatedChatbot;
   }),
   deleteChatbot: PrivateProcedure.input(z.object({
    id: z.string()
   })).mutation(async({input}) => {
    const { id } = input;

    await db.chatbot.delete({
      where: { id },
    });

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
          chatbots: true,
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
  })).mutation(async({input}) => {

    const { chatbotId, name, logo, theme } = input;

    const newBrand = await db.brand.create({
      data: {
        chatbotId,
        name,
        logo,
        theme,
      },
    });

    return newBrand;
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