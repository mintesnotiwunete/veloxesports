'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createTeam(telegramId: number | bigint | string, name: string, description: string, logoUrl?: string) {
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
        logoUrl,
        captainId: user.id,
        members: {
          create: {
            userId: user.id,
            role: 'CAPTAIN',
            status: 'ACTIVE'
          }
        }
      }
    });
    
    revalidatePath('/teams');
    return team;
  } catch (error) {
    console.error('Failed to create team:', error);
    return null;
  }
}

export async function getAllTeams() {
  try {
    return await prisma.team.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { members: true } },
        captain: { select: { id: true, firstName: true, telegramUsername: true } }
      }
    });
  } catch (error) {
    console.error('Failed to get all teams:', error);
    return [];
  }
}

export async function getTeamBySlug(slug: string) {
  try {
    return await prisma.team.findUnique({
      where: { slug },
      include: {
        captain: { select: { id: true, firstName: true, telegramUsername: true, avatarUrl: true } },
        members: {
          include: {
            user: { select: { id: true, firstName: true, telegramUsername: true, avatarUrl: true } }
          },
          orderBy: { joinedAt: 'asc' }
        }
      }
    });
  } catch (error) {
    console.error('Failed to get team by slug:', error);
    return null;
  }
}

export async function requestToJoinTeam(telegramId: number | bigint | string, teamId: string) {
  try {
    const tgBigInt = BigInt(telegramId.toString());
    const user = await prisma.user.findUnique({ where: { telegramId: tgBigInt } });
    if (!user) return null;

    // Check if user is already a member or pending
    const existing = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: user.id } }
    });

    if (existing) return existing;

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) return null;

    const member = await prisma.teamMember.create({
      data: {
        teamId,
        userId: user.id,
        role: 'MEMBER',
        status: 'PENDING'
      }
    });

    // Notify the captain
    await prisma.notification.create({
      data: {
        userId: team.captainId,
        title: 'New Squad Request',
        message: `${user.firstName} wants to join your squad: ${team.name}.`,
        type: `TEAM_REQUEST:${team.slug}`
      }
    });
    
    revalidatePath('/teams/[slug]', 'page');
    return member;
  } catch (error) {
    console.error('Failed to request join team:', error);
    return null;
  }
}

export async function manageTeamRequest(telegramId: number | bigint | string, memberId: string, action: 'ACCEPT' | 'REJECT' | 'KICK') {
  try {
    const tgBigInt = BigInt(telegramId.toString());
    const user = await prisma.user.findUnique({ where: { telegramId: tgBigInt } });
    if (!user) return false;

    const memberRecord = await prisma.teamMember.findUnique({
      where: { id: memberId },
      include: { team: true }
    });

    if (!memberRecord) return false;

    // Check if user is captain
    if (memberRecord.team.captainId !== user.id) return false;

    if (action === 'ACCEPT') {
      await prisma.teamMember.update({
        where: { id: memberId },
        data: { status: 'ACTIVE' }
      });
      await prisma.notification.create({
        data: {
          userId: memberRecord.userId,
          title: 'Squad Application Accepted!',
          message: `You are now a member of ${memberRecord.team.name}!`,
          type: `TEAM_ACCEPT:${memberRecord.team.slug}`
        }
      });
    } else {
      await prisma.teamMember.delete({
        where: { id: memberId }
      });
      // Optionally notify them of rejection, though sometimes silent is preferred.
      if (action === 'REJECT') {
        await prisma.notification.create({
          data: {
            userId: memberRecord.userId,
            title: 'Squad Application Rejected',
            message: `Your request to join ${memberRecord.team.name} was declined.`,
            type: 'INFO'
          }
        });
      }
    }
    
    revalidatePath('/teams/[slug]', 'page');
    return true;
  } catch (error) {
    console.error('Failed to manage team request:', error);
    return false;
  }
}
