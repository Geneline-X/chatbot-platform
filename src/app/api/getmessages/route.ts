import { db } from "@/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chatbotId, cursor, limit } = body;

    if (!chatbotId) {
      return new Response("chatbotId is required", { status: 400 });
    }

    // Default limit to 20 if not provided
    const limitNumber = limit ?? 20;

    const messages = await db.message.findMany({
      where: {
        chatbotId,
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
