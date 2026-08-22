'use server';

import { prisma } from '@/lib/prisma';

export async function getActiveTournaments() {
  return await prisma.tournament.findMany({
    where: { status: 'REGISTRATION_OPEN' },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { game: true }
  });
}

export async function getTournament(slug: string) {
    return await prisma.tournament.findUnique({
        where: { slug },
        include: { game: true }
    });
}
