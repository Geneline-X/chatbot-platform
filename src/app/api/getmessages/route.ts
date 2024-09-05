import { db } from "@/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chatbotId, cursor, limit, email } = body;

    if (!chatbotId) {
      return new Response("chatbotId is required", { status: 400 });
    }

    // Ensure an email is provided
    if (!email) {
      return new Response(JSON.stringify({ messages: [], nextCursor: undefined }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Default limit to 20 if not provided
    const limitNumber = limit ?? 20;

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
      take: limitNumber + 1, 
      select: {
        id: true,
        isUserMessage: true,
        chatbotId: true,
        createAt: true,
        text: true,
      },
    });

    let nextCursor: string | undefined = undefined;

    if (messages.length > limitNumber) {
      const nextItem = messages.pop();
      nextCursor = nextItem?.id;
    }

    return new Response(JSON.stringify({ messages, nextCursor }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(JSON.stringify({ message: "Error Occurred", error }), {
      status: 500,
    });
  }
}
