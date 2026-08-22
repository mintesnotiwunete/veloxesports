import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

  const finalAppUrl = process.env.NEXT_PUBLIC_APP_URL || appUrl;

  if (!botToken || !finalAppUrl) {
    return NextResponse.json({ error: 'Missing TELEGRAM_BOT_TOKEN or App URL in environment variables.' }, { status: 500 });
  }

  // Telegram requires the webhook URL to be HTTPS
  const webhookUrl = `${finalAppUrl}/api/webhooks/telegram`;
  
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}&drop_pending_updates=true`);
    const data = await res.json();
    return NextResponse.json({ 
      success: true, 
      webhookUrlSet: webhookUrl,
      telegramResponse: data 
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to set webhook', details: err.message }, { status: 500 });
  }
}
