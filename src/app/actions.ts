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
        gameProfiles: {
          include: { game: true }
        },
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

export async function getUserMatches(telegramId?: number | bigint | string) {
  if (!telegramId) return [];
  try {
    const tgBigInt = BigInt(telegramId.toString());
    const user = await prisma.user.findUnique({ where: { telegramId: tgBigInt } });
    if (!user) return [];

    return await prisma.match.findMany({
      where: {
        OR: [
          { player1Id: user.id },
          { player2Id: user.id }
        ]
      },
      orderBy: { scheduledAt: 'asc' },
      include: {
        tournament: { select: { name: true, game: { select: { name: true } } } },
        player1: { select: { id: true, firstName: true, telegramUsername: true, avatarUrl: true } },
        player2: { select: { id: true, firstName: true, telegramUsername: true, avatarUrl: true } },
        winner: { select: { id: true, firstName: true } }
      }
    });
  } catch (error) {
    console.error('Failed to get user matches:', error);
    return [];
  }
}

export async function submitMatchResult(matchId: string, player1Score: number, player2Score: number, evidenceUrl: string, submittedById: string) {
  try {
    return await prisma.match.update({
      where: { id: matchId },
      data: {
        status: 'SUBMITTED',
        player1Score,
        player2Score,
        evidenceUrl,
        submittedById
      }
    });
  } catch (error) {
    console.error('Failed to submit result:', error);
    return null;
  }
}

export async function getPendingMatches() {
  try {
    return await prisma.match.findMany({
      where: { status: 'SUBMITTED' },
      orderBy: { scheduledAt: 'desc' },
      include: {
        tournament: { select: { name: true } },
        player1: { select: { id: true, firstName: true } },
        player2: { select: { id: true, firstName: true } }
      }
    });
  } catch (error) {
    console.error('Failed to get pending matches:', error);
    return [];
  }
}

export async function resolveMatch(matchId: string, status: string, winnerId?: string) {
  try {
    return await prisma.match.update({
      where: { id: matchId },
      data: {
        status,
        winnerId: winnerId || null
      }
    });
  } catch (error) {
    console.error('Failed to resolve match:', error);
    return null;
  }
}

export async function getMatchById(matchId: string) {
  try {
    return await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        tournament: { select: { name: true, rules: true, game: { select: { name: true } } } },
        player1: { select: { id: true, firstName: true, telegramUsername: true, avatarUrl: true } },
        player2: { select: { id: true, firstName: true, telegramUsername: true, avatarUrl: true } },
        winner: { select: { id: true, firstName: true } }
      }
    });
  } catch (error) {
    console.error('Failed to get match:', error);
    return null;
  }
}

export async function linkGameProfile(telegramId: number | bigint | string, gameId: string, gameUsername: string) {
  try {
    const tgBigInt = BigInt(telegramId.toString());
    const user = await prisma.user.findUnique({ where: { telegramId: tgBigInt } });
    if (!user) return null;

    const existing = await prisma.gameProfile.findFirst({ where: { userId: user.id, gameId } });

    if (existing) {
      return await prisma.gameProfile.update({ where: { id: existing.id }, data: { gameUsername } });
    } else {
      return await prisma.gameProfile.create({ data: { userId: user.id, gameId, gameUsername } });
    }
  } catch (error) {
    console.error('Failed to link game profile:', error);
    return null;
  }
}

export async function getUserTeam(telegramId: number | bigint | string) {
  try {
    const tgBigInt = BigInt(telegramId.toString());
    const user = await prisma.user.findUnique({ where: { telegramId: tgBigInt } });
    if (!user) return null;

    const member = await prisma.teamMember.findFirst({
      where: { userId: user.id },
      include: {
        team: {
          include: {
            members: { include: { user: { select: { id: true, firstName: true, telegramUsername: true, avatarUrl: true } } } },
            captain: { select: { id: true, firstName: true } }
          }
        }
      }
    });

    return member ? member.team : null;
  } catch (error) {
    console.error('Failed to get user team:', error);
    return null;
  }
}

export async function createTeam(telegramId: number | bigint | string, name: string, description: string) {
  try {
    const tgBigInt = BigInt(telegramId.toString());
    const user = await prisma.user.findUnique({ where: { telegramId: tgBigInt } });
    if (!user) return null;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const team = await prisma.team.create({
      data: {
        name,
        slug,
        description,
        captainId: user.id,
        members: {
          create: {
            userId: user.id,
            role: 'CAPTAIN'
          }
        }
      }
    });
    return team;
  } catch (error) {
    console.error('Failed to create team:', error);
    return null;
  }
}

export async function getAnnouncements() {
  try {
    return await prisma.announcement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
  } catch (error) {
    console.error('Failed to get announcements:', error);
    return [];
  }
}

export async function createAnnouncement(title: string, content: string, type: string = 'INFO') {
  try {
    return await prisma.announcement.create({
      data: { title, content, type }
    });
  } catch (error) {
    console.error('Failed to create announcement:', error);
    return null;
  }
}

export async function globalSearch(query: string) {
  if (!query || query.trim().length < 2) return { tournaments: [], players: [], teams: [] };
  
  const searchStr = query.trim();
  
  try {
    const [tournaments, players, teams] = await Promise.all([
      prisma.tournament.findMany({
        where: { name: { contains: searchStr, mode: 'insensitive' } },
        take: 5,
        include: { game: { select: { name: true } } }
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: searchStr, mode: 'insensitive' } },
            { telegramUsername: { contains: searchStr, mode: 'insensitive' } }
          ]
        },
        take: 5
      }),
      prisma.team.findMany({
        where: { name: { contains: searchStr, mode: 'insensitive' } },
        take: 5,
        include: { _count: { select: { members: true } } }
      })
    ]);

    return { tournaments, players, teams };
  } catch (error) {
    console.error('Failed to global search:', error);
    return { tournaments: [], players: [], teams: [] };
  }
}

export async function getUserNotifications(telegramId: number | bigint | string) {
  try {
    const tgBigInt = BigInt(telegramId.toString());
    const user = await prisma.user.findUnique({ where: { telegramId: tgBigInt } });
    if (!user) return [];

    return await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  } catch (error) {
    console.error('Failed to get notifications:', error);
    return [];
  }
}

export async function markNotificationsRead(telegramId: number | bigint | string) {
  try {
    const tgBigInt = BigInt(telegramId.toString());
    const user = await prisma.user.findUnique({ where: { telegramId: tgBigInt } });
    if (!user) return;

    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true }
    });
  } catch (error) {
    console.error('Failed to mark notifications read:', error);
  }
}

export async function getUnreadNotificationCount(telegramId: number | bigint | string) {
  try {
    const tgBigInt = BigInt(telegramId.toString());
    const user = await prisma.user.findUnique({ where: { telegramId: tgBigInt } });
    if (!user) return 0;

    return await prisma.notification.count({
      where: { userId: user.id, isRead: false }
    });
  } catch (error) {
    console.error('Failed to get unread notification count:', error);
    return 0;
  }
}

export async function getDisputedMatches() {
  try {
    return await prisma.match.findMany({
      where: { status: 'DISPUTED' },
      orderBy: { scheduledAt: 'desc' },
      include: {
        tournament: { select: { name: true } },
        player1: { select: { id: true, firstName: true } },
        player2: { select: { id: true, firstName: true } }
      }
    });
  } catch (error) {
    console.error('Failed to get disputed matches:', error);
    return [];
  }
}

export async function getPayouts() {
  try {
    return await prisma.payout.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, telegramUsername: true } },
        tournament: { select: { id: true, name: true } }
      }
    });
  } catch (error) {
    console.error('Failed to get payouts:', error);
    return [];
  }
}

export async function processPayout(payoutId: string, status: string) {
  try {
    return await prisma.payout.update({
      where: { id: payoutId },
      data: { status }
    });
  } catch (error) {
    console.error('Failed to process payout:', error);
    return null;
  }
}
