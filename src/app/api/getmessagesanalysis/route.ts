import { db } from "@/db";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { genAI } from "@/lib/gemini";
import { cosineSimilaritySearch } from "@/lib/elegance";
import { TRPCError } from "@trpc/server";

const extractionInstruction = `
You are an assistant tasked with analyzing the provided messages and extracting relevant insights. Your response should include:

1. **Frequently Asked Questions:** A list of common questions that users have based on the messages.
2. **Sentiment Analysis:** An analysis of the sentiment of the messages, including any relevant sentiment metrics.

Please structure your response as a JSON object with the following properties:
- **frequentlyAskedQuestions**: An array of strings, each representing a frequently asked question.
- **sentimentAnalysis**: An object with sentiment metrics where keys are sentiment types (e.g., 'positive', 'negative', 'neutral') and values are their respective counts or percentages.

Example response format:
{
  "frequentlyAskedQuestions": [
    "What is the return policy?",
    "How can I track my order?"
  ],
  "sentimentAnalysis": {
    "positive": 50,
    "negative": 30,
    "neutral": 20
  }
}

Ensure that the output strictly adheres to this JSON structure. If no relevant information is found, provide empty arrays or objects as needed.
`;


export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log("Received body:", body);

    const { chatbotId } = body;

    if (!chatbotId) {
      throw new TRPCError({ message: "Chatbot ID is required", code: "BAD_REQUEST" });
    }

    // Fetch all messages for the given chatbotId
    const messages = await db.message.findMany({
      where: { chatbotId },
      orderBy: { createAt: "asc" },
    });

    if (messages.length === 0) {
      throw new TRPCError({ message: "No messages found for the given chatbot", code: "NOT_FOUND" });
    }

    // Format messages for LLM
    const formattedMessages = messages.map(msg => `Message ID: ${msg.id}\n${msg.text}`).join("\n\n");

    // Fetch chatbot configurations
    const chatbot = await db.chatbot.findFirst({
      where: { id: chatbotId },
    });

    if (!chatbot) {
      throw new TRPCError({ message: "Chatbot not found", code: "NOT_FOUND" });
    }

    // Initialize LLM
    const llm = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: extractionInstruction,
    });

    // Construct the message for the LLM
    const msg = `${extractionInstruction}\n\nMessages:\n${formattedMessages}`;

    // Get the LLM response
    const result = await llm.generateContent(msg);

    // Extract the response text and clean it up
    let responseText = result.response.text();
    // Remove markdown code block delimiters
    responseText = responseText.replace(/```json\s*|\s*```/g, '');

    // Parse and format the response text if it's in JSON format
    const parsedResponse = JSON.parse(responseText);

    // Send the response back to the client
    return new Response(JSON.stringify({
      analysis: parsedResponse,
    }), { status: 200 });

  } catch (error:any) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
};
