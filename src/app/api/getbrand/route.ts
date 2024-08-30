import { db } from "@/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chatbotId } = body;

    if (!chatbotId) {
      return new Response("chatbotId is required", { status: 400 });
    }

    const brand = await db.brand.findFirst({
      where: { chatbotId },
    });

    if (!brand) {
      return new Response("Brand not found", { status: 404 });
    }

    return new Response(JSON.stringify(brand), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: "Error Occurred", error }), {
      status: 500,
    });
  }
}
