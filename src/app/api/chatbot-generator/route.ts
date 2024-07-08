import { db } from "@/db"

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const config = body.config;
  
      const chatbotContent = generateIframeContent(config);
  
      return new Response(JSON.stringify(chatbotContent), {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      });
    } catch (error) {
      console.error('Error generating iframe:', error);
  
      return new Response(JSON.stringify({ message: 'Internal server error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }

async function generateIframeContent(config:any) {
    return  `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Embedded Chatbot</title>
        <style>
          /* Add your styles here */
        </style>
      </head>
      <body>
        <div id="chatbot-container"></div>
        <script type="module">
          import initializeChatbot from '/path/to/chatbot.js';
          const config = ${JSON.stringify(config)};
          window.addEventListener('DOMContentLoaded', () => {
            initializeChatbot(config);
          });
        </script>
      </body>
    </html>
  `;
}