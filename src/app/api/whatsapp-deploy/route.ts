import { db } from "@/db"
import axios from 'axios';

import twilio from "twilio"

import { 
  initiateTwilioOAuth, 
  fetchAvailableNumbers, 
  enableWhatsAppForChatbot,
  purchaseNumber,

} from "@/lib/utils";
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { chatbotId } = body;

      const chatbot = await db.chatbot.findUnique({
        where: { id: chatbotId },
        include: { Business: true }
      });

      if (!chatbot) {
        return new Response(JSON.stringify({ error: 'Chatbot not found'}), {status: 404});
      }
  
      
      // Check if a WhatsApp number is already associated with this chatbot
    if (chatbot.whatsappPhoneNumber) {
      return new Response(JSON.stringify({ success: true, phoneNumber: chatbot.whatsappPhoneNumber }), {status: 200});
    }

    // Purchase a new WhatsApp-enabled number
    const availableNumbers = await twilioClient.availablePhoneNumbers('US').local.list({
      smsEnabled: true,
      mmsEnabled: true
    });

    if (availableNumbers.length === 0) {
      return new Response(JSON.stringify({ error: 'No available WhatsApp numbers' }), {status: 400});
    }
    
    const purchasedNumber = await twilioClient.incomingPhoneNumbers.create({
      phoneNumber: availableNumbers[0].phoneNumber,
      smsUrl: `${process.env.APP_URL}/api/twilio-webhook/${chatbotId}`,
      smsMethod: 'POST'
    });

     // Update the chatbot with the new WhatsApp number
    await db.chatbot.update({
      where: { id: chatbotId },
      data: {
        whatsappEnabled: true,
        whatsappPhoneNumber: purchasedNumber.phoneNumber
      }
    });

    return new Response(JSON.stringify({ success: true, phoneNumber: purchasedNumber.phoneNumber }), {status: 200});
  
    } catch (error) {
      console.error('Error exporting chatbot to WhatsApp:', error);
      return new Response(JSON.stringify({ error: 'Failed to export chatbot to WhatsApp' }), { status: 500 })
    }
}

