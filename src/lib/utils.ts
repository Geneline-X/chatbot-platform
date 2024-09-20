import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Metadata } from "next"
import { db } from "@/db"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function constructMetaData({
  title =  "GeniStudio - the Platform to fully build and customize your chatbots with no code",
  description = "GeniStudio is Platform that makes building chatbots easily, with no code at all.",
  image = "/genistudio-cover.png",
  icons = "/favicon.ico",
  noIndex = false,
  manifest="/manifest.json"
}: {
  title?: string
  manifest?: string
  description?: string
  image?: string
  icons?: string
  noIndex?:boolean
} = {}) : Metadata {
  return {
    manifest,
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url:image
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@DKamara36931"
    },
    icons,
    metadataBase: new URL("https://geneline-x.net"),
    themeColor: "#FFF",
    ...(noIndex && {
      robots: {
        index:false,
        follow:false
      }
    })
  }
}

// utils/validateEmail.ts
export const isValidEmail = (email: string): boolean => {
  // Regular expression for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function getSession() {
  const session = document.cookie.match(/chatbotSession=([^;]+)/);
  return session ? session[1] : null;
}

export function setSession(sessionId: string) {
  document.cookie = `chatbotSession=${sessionId}; path=/; max-age=1800`; // 30 minutes session
}

export function storeMessage(message: any) {
  const sessionId = getSession();
  if (!sessionId) return; // No session, so don't store messages

  const messages = JSON.parse(localStorage.getItem(`chatMessages_${sessionId}`) || '[]');
  messages.push(message);
  localStorage.setItem(`chatMessages_${sessionId}`, JSON.stringify(messages));
}

export function clearMessages() {
  const sessionId = getSession();
  if (sessionId) {
      localStorage.removeItem(`chatMessages_${sessionId}`);
  }
}


// In-memory storage to hold messages by session ID
const inMemoryStore = new Map<string, { message: any; timestamp: number }[]>();

// Utility function to store a message in memory with a timestamp
export const storeInMemoryMessage = (sessionId: string, message: any) => {
  if (!inMemoryStore.has(sessionId)) {
    inMemoryStore.set(sessionId, []);
  }
  inMemoryStore.get(sessionId)?.push({
    message,
    timestamp: Date.now(),
  });
  console.log(inMemoryStore);
};

// Utility function to retrieve messages from memory
export const getInMemoryMessages = (sessionId: string) => {
  const messages = inMemoryStore.get(sessionId) || [];
  return messages.map(entry => entry.message);
};

// Utility function to clear old messages from memory
const cleanupOldMessages = () => {
  const expirationTime =  15 * 60 * 1000; // 15 * 60 * 15 minutes in milliseconds
  const now = Date.now();

  //@ts-ignore
  for (const [sessionId, messages] of inMemoryStore.entries()) {
    const recentMessages = messages.filter((entry:any) => now - entry.timestamp < expirationTime);
    
    if (recentMessages.length === 0) {
      inMemoryStore.delete(sessionId);
    } else {
      inMemoryStore.set(sessionId, recentMessages);
    }
  }
};

// Schedule cleanup every 15 minutes
setInterval(cleanupOldMessages,  15 * 60 *1000); //15 * 60 *

export const clearInMemoryMessages = (sessionId: string) => {
  inMemoryStore.delete(sessionId);
};


export async function enableWhatsAppForChatbot(chatbotId: string, phoneNumber: string) {
  await db.chatbot.update({
    where: { id: chatbotId },
    data: { 
      whatsappEnabled: true,
      whatsappPhoneNumber: phoneNumber
    }
  });
}

export async function purchaseNumber(twilioAxios: any, phoneNumber: string) {
  const response = await twilioAxios.post('/2010-04-01/Accounts/IncomingPhoneNumbers.json', {
    PhoneNumber: phoneNumber,
    SmsUrl: `${process.env.APP_URL}/api/twilio-webhook`,  // Webhook to handle incoming WhatsApp messages
    SmsMethod: 'POST',
  });
  return response.data;
}


export async function initiateTwilioOAuth(businessId: string) {
  const clientId = process.env.TWILIO_CLIENT_ID;  // Twilio Client ID
  const redirectUri = `${process.env.APP_URL}/api/twilio-callback?businessId=${businessId}`;  // Your platform's callback URL
  const scope = 'incoming-phone-numbers.write incoming-phone-numbers.read messages.write messages.read';  // Scopes for OAuth

  // Correct Twilio OAuth URL
  return `https://www.twilio.com/console/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
}


export async function fetchAvailableNumbers(twilioAxios: any) {
  const response = await twilioAxios.get('/2010-04-01/Accounts/AvailablePhoneNumbers/US/Mobile.json', {
    params: { SmsEnabled: true, MmsEnabled: true }
  });
  return response.data.available_phone_numbers;
}