import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect(new URL('/profile?error=discord_auth_failed', req.url));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  try {
    // 1. Parse state to get user ID
    const decodedState = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
    const telegramUserId = decodedState.telegramUserId;

    // 2. Exchange code for token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri!,
      })
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) throw new Error(tokenData.error_description);

    // 3. Get Discord User Profile
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: "Bearer ${tokenData.access_token}" }
    });

    const discordUser = await userResponse.json();
    if (!discordUser.id) throw new Error('Failed to get discord profile');

    // 4. Link to Telegram User in our Database
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramUserId) }
    });

    if (user) {
      await prisma.discordAccount.upsert({
        where: { userId: user.id },
        update: {
          discordUserId: discordUser.id,
          discordUsername: "@${discordUser.username}",
        },
        create: {
          userId: user.id,
          discordUserId: discordUser.id,
          discordUsername: "@${discordUser.username}",
        }
      });
    }

    return NextResponse.redirect(new URL('/profile?discord_linked=success', req.url));

  } catch (error) {
    console.error('Discord Auth Error:', error);
    return NextResponse.redirect(new URL('/profile?error=discord_auth_failed', req.url));
  }
}
