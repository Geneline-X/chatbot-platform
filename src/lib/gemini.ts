import { GoogleGenerativeAI, } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/files";

import { HarmBlockThreshold, HarmCategory, HarmProbability, } from "@google/generative-ai";
import { db } from "@/db";

// model 1
export const genAI = new GoogleGenerativeAI(
    process.env.GOOGLE_GEMINI_MODEL_BILLING!,

);



export const fileManager = new GoogleAIFileManager(process.env.GOOGLE_GEMINI_MODEL_BILLING!);

export const llm = genAI.getGenerativeModel({model:"gemini-1.5-flash"})
export const model = genAI.getGenerativeModel({ model: "embedding-001" });


