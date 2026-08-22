import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  
  if (!clientId || !redirectUri) {
    return NextResponse.json({ error: 'Discord OAuth not configured' }, { status: 500 });
  }

  // Need to pass telegram initData so we know who to link the account to on callback.
  // In a real app we might use a session cookie or sign a state JWT.
  const { searchParams } = new URL(req.url);
  const telegramUserId = searchParams.get('userId');

  if (!telegramUserId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  // State parameter to prevent CSRF and pass user context
  const state = Buffer.from(JSON.stringify({ telegramUserId })).toString('base64');

  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify&state=${state}`;

  return NextResponse.redirect(authUrl);
}
