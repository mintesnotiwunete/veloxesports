import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Quick and dirty game lookup for the MVP
    const game = await prisma.game.findFirst({
      where: { slug: data.gameSlug }
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const tournament = await prisma.tournament.create({
      data: {
        name: data.name,
        slug: slug,
        description: 'New tournament',
        format: 'SINGLE_ELIMINATION',
        status: 'REGISTRATION_OPEN',
        entryFeeStars: parseInt(data.entryFeeStars),
        prizePool: data.prizePool,
        maxPlayers: parseInt(data.maxPlayers),
        currentPlayers: 0,
        registrationStart: new Date(),
        registrationEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        startTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        gameId: game.id
      }
    });

    return NextResponse.json({ success: true, tournament });
  } catch (error) {
    console.error('Failed to create tournament:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
