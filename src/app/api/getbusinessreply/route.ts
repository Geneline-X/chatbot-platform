import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const email = searchParams.get('email');
  const cursor = searchParams.get('cursor');
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  try {
    const replies = await db.businessReply.findMany({
      where: {
        chatbotInteraction: {
          chatbotUser: {
            email: email
          }
        }
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: {
        timestamp: 'desc'
      },
      include: {
        chatbotInteraction: {
          include: {
            chatbotUser: {
              select: {
                email: true
              }
            }
          }
        }
      }
    });

    let nextCursor: string | undefined = undefined;
    if (replies.length > limit) {
      const nextItem = replies.pop();
      nextCursor = nextItem?.id;
    }

    return NextResponse.json({
      replies: replies.map(reply => ({
        id: reply.id,
        text: reply.text,
        timestamp: reply.timestamp,
        sentBy: reply.sentBy,
        userEmail: reply.chatbotInteraction.chatbotUser.email
      })),
      nextCursor
    }, {status: 200});
  } catch (error) {
    console.error('Error fetching business replies:', error);
    return NextResponse.json({ error: 'An error occurred while fetching business replies' }, { status: 500 });
  }
}