import { db } from "@/db";

import twilio from "twilio"

const MessagingResponse = twilio.twiml.MessagingResponse;

export async function POST(req: Request, { params }: { params: { chatbotId: string } }) {
    try {
        const { chatbotId } = params;
        const body = await req.formData();
        
        const from = body.get('From') as string;
        const messageBody = body.get('Body') as string;
      
         // Check if it's a WhatsApp message
        const isWhatsApp = from.startsWith('whatsapp:');

        // Fetch the chatbot
        const chatbot = await db.chatbot.findUnique({ where: { id: chatbotId } });

        if (!chatbot) {
         return new Response(JSON.stringify({ error: 'Chatbot not found' }), { status: 404 })
        }

        // Process the message with your chatbot logic
        const response = await processChatbotMessage(chatbot, messageBody, isWhatsApp);

         // Create a TwiML response
            const twiml = new MessagingResponse();
            twiml.message(response);

            // Send the response back to Twilio
            return new Response(JSON.stringify(twiml.toString()), { 
                status: 200,
                headers: {
                    'Content-Type': 'text/xml',
                },
            })
            
        } catch (error) {
            console.error('Error processing webhook:', error); 
        }
}

async function processChatbotMessage(chatbot: any, message: string, isWhatsApp: boolean) {
    // Implement your chatbot logic here
    // This is where you'd integrate with your AI or rule-based system
    return `Chatbot ${chatbot.name} received: ${message} via ${isWhatsApp ? 'WhatsApp' : 'SMS'}`;
  }
