import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Robust game lookup
    const game = await prisma.game.findFirst({
      where: { slug: data.gameSlug.toLowerCase().trim() }
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found. Valid options: fc26, fortnite' }, { status: 404 });
    }

    let slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check if slug exists to avoid unique constraint error
    const existing = await prisma.tournament.findUnique({ where: { slug } });
    if (existing) {
        slug = slug + '-' + Math.floor(Math.random() * 1000);
    }

    const tournament = await prisma.tournament.create({
      data: {
        name: data.name,
        slug: slug,
        description: 'New tournament',
        format: 'SINGLE_ELIMINATION',
        status: 'REGISTRATION_OPEN',
        entryFeeStars: parseInt(data.entryFeeStars) || 0,
        prizePool: data.prizePool,
        maxPlayers: parseInt(data.maxPlayers) || 64,
        currentPlayers: 0,
        registrationStart: new Date(),
        registrationEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        startTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        gameId: game.id
      }
    });

    return NextResponse.json({ success: true, tournament });
  } catch (error: any) {
    console.error('Failed to create tournament:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
