import { z } from "zod";

export const SendMessageValidators = z.object({
    chatbotId: z.string(),
    message: z.string(),
    email: z.string().optional(),
    sessionId: z.string().optional(),
    isUrlFile: z.boolean().optional(),
})