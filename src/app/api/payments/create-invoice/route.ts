import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateWebAppData } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { initData, tournamentId } = body;

    if (!initData || !tournamentId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
    }

    // Validate request is from a real Telegram user
    const isValid = validateWebAppData(initData, botToken);
    if (!isValid && process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
    }

    // Parse user ID from initData
    const urlParams = new URLSearchParams(initData);
    const userJson = urlParams.get('user');
    let telegramUserId = '';
    
    if (userJson) {
      const user = JSON.parse(userJson);
      telegramUserId = user.id.toString();
    } else if (process.env.NODE_ENV === 'development') {
      telegramUserId = '12345678';
    }

    if (!telegramUserId) {
      return NextResponse.json({ error: 'Could not identify user' }, { status: 401 });
    }

    // Fetch tournament details
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId }
    });

    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    if (tournament.status !== 'REGISTRATION_OPEN') {
      return NextResponse.json({ error: 'Registration is not open for this tournament' }, { status: 400 });
    }

    // Upsert user to ensure they exist in DB
    const dbUser = await prisma.user.upsert({
      where: { telegramId: BigInt(telegramUserId) },
      update: { lastActiveAt: new Date() },
      create: {
        telegramId: BigInt(telegramUserId),
        firstName: 'Player', // Will be updated by a separate sync process ideally
      }
    });

    // Check if user is already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        userId: dbUser.id,
        tournamentId: tournament.id,
        status: 'CONFIRMED'
      }
    });

    if (existingRegistration) {
      return NextResponse.json({ error: 'Already registered' }, { status: 400 });
    }

    // Create a pending registration and payment record
    const registration = await prisma.registration.create({
      data: {
        userId: dbUser.id,
        tournamentId: tournament.id,
        status: 'PENDING'
      }
    });

    const invoicePayload = "registration_${registration.id}";
    
    await prisma.payment.create({
      data: {
        userId: dbUser.id,
        tournamentId: tournament.id,
        registrationId: registration.id,
        amountStars: tournament.entryFeeStars,
        invoicePayload: invoicePayload
      }
    });

    // If entry fee is 0, confirm immediately
    if (tournament.entryFeeStars === 0) {
      await prisma.registration.update({
        where: { id: registration.id },
        data: { status: 'CONFIRMED' }
      });
      return NextResponse.json({ success: true, isFree: true, registrationId: registration.id });
    }

    // Call Telegram API to create invoice link
    const telegramApiUrl = "https://api.telegram.org/bot${botToken}/createInvoiceLink";
    const invoiceResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: "Registration: ${tournament.name}",
        description: "Entry fee for ${tournament.name}",
        payload: invoicePayload,
        provider_token: '', // Must be empty for Stars
        currency: 'XTR',
        prices: [{ label: 'Entry Fee', amount: tournament.entryFeeStars }]
      })
    });

    const invoiceData = await invoiceResponse.json();
    
    if (!invoiceData.ok) {
      console.error('Telegram API Error:', invoiceData);
      return NextResponse.json({ error: 'Failed to create payment invoice' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      invoiceUrl: invoiceData.result,
      registrationId: registration.id
    });

  } catch (error) {
    console.error('Create Invoice Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
