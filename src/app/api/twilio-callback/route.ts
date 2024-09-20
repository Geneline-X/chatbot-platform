import { NextResponse } from 'next/server';
import { db } from "@/db";
import axios from 'axios';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const businessId = searchParams.get('businessId');

    if (!code || !businessId) {
        return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
    }

    const clientId = process.env.TWILIO_CLIENT_ID;
    const clientSecret = process.env.TWILIO_CLIENT_SECRET;
    const redirectUri = `${process.env.APP_URL}/api/twilio-callback`;

    const response = await axios.post('https://api.twilio.com/oauth/token', {
      grant_type: 'authorization_code',
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    });

    const { access_token, refresh_token } = response.data;

    // Store tokens in the database
    await db.business.update({
      where: { id: businessId },
      data: {
        twilioAccessToken: access_token,
        twilioRefreshToken: refresh_token,
      }
    });

    // Redirect back to the chatbot dashboard
    return Response.redirect(`${process.env.APP_URL}/chatbot-dashboard/chabots?connection=success`)
  } catch (error) {
    console.error('Error handling Twilio callback:', error);
    return Response.redirect(`${process.env.APP_URL}/chatbot-dashboard/chabots?connection=error`)
  }
}