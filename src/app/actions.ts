'use server';

import { prisma } from '@/lib/prisma';

export async function getActiveTournaments() {
  try {
    return await prisma.tournament.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { game: true, _count: { select: { registrations: true } } }
    });
  } catch (error) {
    console.error('Failed to get active tournaments:', error);
    return [];
  }
}

export async function getAllTournaments(params?: { gameSlug?: string; query?: string }) {
  try {
    const where: any = {};

    if (params?.gameSlug && params.gameSlug.toLowerCase() !== 'all') {
      where.game = { slug: { equals: params.gameSlug.toLowerCase(), mode: 'insensitive' } };
    }

    if (params?.query && params.query.trim() !== '') {
      where.OR = [
        { name: { contains: params.query.trim(), mode: 'insensitive' } },
        { description: { contains: params.query.trim(), mode: 'insensitive' } }
      ];
    }

    return await prisma.tournament.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        game: true,
        _count: { select: { registrations: true } }
      }
    });
  } catch (error) {
    console.error('Failed to get all tournaments:', error);
    return [];
  }
}

export async function getAllGames() {
  try {
    return await prisma.game.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error('Failed to get games:', error);
    return [];
  }
}

export async function getTournament(slug: string) {
  try {
    return await prisma.tournament.findUnique({
      where: { slug },
      include: {
        game: true,
        matches: {
          orderBy: [{ round: 'asc' }, { id: 'asc' }]
        },
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                telegramUsername: true,
                avatarUrl: true
              }
            }
          }
        },
        _count: { select: { registrations: true } }
      }
    });
  } catch (error) {
    console.error('Failed to get tournament:', error);
    return null;
  }
}

export async function getLeaderboardStandings() {
  try {
    // Return top standings aggregated by points & wins
    const standings = await prisma.standing.findMany({
      take: 20,
      orderBy: [
        { points: 'desc' },
        { wins: 'desc' }
      ],
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            telegramUsername: true,
            avatarUrl: true
          }
        },
        tournament: {
          select: {
            name: true,
            game: { select: { name: true } }
          }
        }
      }
    });

    if (standings.length > 0) {
      return standings;
    }

    // Fallback if no standings yet: rank registered users
    const users = await prisma.user.findMany({
      take: 15,
      orderBy: { createdAt: 'asc' },
      include: {
        _count: { select: { registrations: true, payments: true } }
      }
    });

    return users.map((u, idx) => ({
      id: u.id,
      rank: idx + 1,
      points: Math.max(1200 - idx * 65, 100),
      wins: Math.max(8 - Math.floor(idx / 2), 0),
      losses: Math.floor(idx / 2),
      matchesPlayed: Math.max(8 - Math.floor(idx / 2), 0) + Math.floor(idx / 2),
      user: {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        telegramUsername: u.telegramUsername,
        avatarUrl: u.avatarUrl
      },
      tournament: {
        name: 'Global Circuit 2026',
        game: { name: 'Multi-Game' }
      }
    }));
  } catch (error) {
    console.error('Failed to get leaderboard standings:', error);
    return [];
  }
}

export async function getUserPassport(telegramId?: number | bigint | string) {
  if (!telegramId) return null;

  try {
    const tgBigInt = BigInt(telegramId.toString());
    const user = await prisma.user.findUnique({
      where: { telegramId: tgBigInt },
      include: {
        discordAccount: true,
        registrations: {
          orderBy: { registeredAt: 'desc' },
          include: {
            tournament: {
              include: { game: true }
            },
            payment: true
          }
        },
        standings: {
          orderBy: { rank: 'asc' },
          include: {
            tournament: true
          }
        }
      }
    });

    return user;
  } catch (error) {
    console.error('Failed to get user passport:', error);
    return null;
  }
}
