import { z } from "zod";

export const SendMessageValidators = z.object({
    chatbotId: z.string(),
    message: z.string(),
    isUrlFile: z.boolean().optional(),
})