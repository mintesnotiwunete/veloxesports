import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const update = await req.json();

    // Handle pre_checkout_query for Stars (optional, Telegram might auto-approve Stars)
    if (update.pre_checkout_query) {
      const { id, payload } = update.pre_checkout_query;
      
      // Verify payload exists in our DB
      const payment = await prisma.payment.findUnique({
        where: { invoicePayload: payload }
      });

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      
      const ok = !!payment && payment.status === 'PENDING';
      
      await fetch(`https://api.telegram.org/bot${botToken}/answerPreCheckoutQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pre_checkout_query_id: id,
          ok: ok,
          error_message: ok ? undefined : 'Invalid payment or already processed.'
        })
      });
      
      return NextResponse.json({ success: true });
    }

    // Handle successful_payment
    if (update.message?.successful_payment) {
      const paymentInfo = update.message.successful_payment;
      const payload = paymentInfo.invoice_payload;
      const telegramPaymentId = paymentInfo.telegram_payment_charge_id;

      // Find pending payment
      const payment = await prisma.payment.findUnique({
        where: { invoicePayload: payload }
      });

      if (payment && payment.status === 'PENDING') {
        // Use a transaction to update payment and registration atomically
        let telegramUserId: bigint | undefined;
        let tournamentName = '';

        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              status: 'SUCCESS',
              telegramPaymentId: telegramPaymentId,
              paidAt: new Date()
            }
          });

          const reg = await tx.registration.update({
            where: { id: payment.registrationId },
            data: { status: 'CONFIRMED' },
            include: { user: true, tournament: true }
          });
          
          telegramUserId = reg.user.telegramId;
          tournamentName = reg.tournament.name;
        });
        
        console.log(`Payment confirmed for payload: ${payload}`);
        
        if (telegramUserId) {
          const { sendTelegramNotification } = await import('@/lib/telegram-bot');
          await sendTelegramNotification(
            telegramUserId,
            `🎉 <b>Registration Confirmed!</b>\n\nYou are successfully registered for <b>${tournamentName}</b>.\n\nGood luck, champion! 🏆`
          );
        }
      }
      
    // Handle /start command
    if (update.message?.text === '/start' || update.message?.text === '/open') {
      const chatId = update.message.chat.id;
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://velox-esports.vercel.app';
      
      const welcomeText = `🚀 <b>Welcome to Velox Esports!</b>\n\nThe ultimate arena for competitive gaming on Telegram.\n\n🏆 <b>Play Tournaments</b>\n💰 <b>Earn Real Prizes</b>\n🎮 <b>Prove Your Skill</b>\n\nTap the button below to launch the command center and enter the arena.`;

      // You can send a photo by using sendPhoto instead of sendMessage
      const imageUrl = `${appUrl}/logo.png`; // Ensure this is a fully qualified URL to your logo

      await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: imageUrl,
          caption: welcomeText,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [{ text: '🕹️ Launch Velox App', web_app: { url: appUrl } }],
              [{ text: '🌐 Join Community', url: 'https://t.me/veloxesports' }]
            ]
          }
        })
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true }); // Always return 200 to Telegram
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
