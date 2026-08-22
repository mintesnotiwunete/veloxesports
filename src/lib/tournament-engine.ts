import { prisma } from './prisma';

export async function generateSingleEliminationBracket(tournamentId: string) {
  const registrations = await prisma.registration.findMany({
    where: { tournamentId, status: 'CONFIRMED' },
    orderBy: { registeredAt: 'asc' } // Basic seeding based on registration time
  });

  if (registrations.length < 2) throw new Error('Not enough players');

  // Next power of 2 for bracket sizing
  const numPlayers = registrations.length;
  const bracketSize = Math.pow(2, Math.ceil(Math.log2(numPlayers)));
  const byes = bracketSize - numPlayers;

  // Shuffle or seed players. We'll just use the array order for now.
  const players = registrations.map(r => r.userId);
  
  // Pad with nulls for byes
  for (let i = 0; i < byes; i++) players.push(null as unknown as string);

  // Round 1 matches
  const matches = [];
  let matchId = 1;

  for (let i = 0; i < bracketSize; i += 2) {
    const p1 = players[i];
    const p2 = players[i+1];
    
    // If one is a bye, the other auto-advances, but we still create the match record for structure
    matches.push({
      tournamentId,
      round: 1,
      player1Id: p1,
      player2Id: p2,
      status: p2 === null ? 'COMPLETED' : 'SCHEDULED',
      winnerId: p2 === null ? p1 : null
    });
  }

  // Insert matches into DB
  await prisma.match.createMany({
    data: matches
  });

  return matches;
}

export const SCORING_RULES = {
  // EA Sports FC 26 standard rules
  'fc26': { win: 3, draw: 1, loss: 0 },
  // Chess standard rules (points typically multiplied by 2 to avoid decimals in db, but let's use 10/5/0)
  'chess': { win: 10, draw: 5, loss: 0 },
  // Battle Royale / Shooter (e.g. Fortnite) points
  'fortnite': { win: 10, draw: 0, loss: 0, elimination: 2 }
};

export async function submitMatchResult(matchId: string, p1Score: number, p2Score: number) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { tournament: { include: { game: true } } }
  });

  if (!match) throw new Error('Match not found');
  if (match.status === 'COMPLETED') throw new Error('Match already completed');

  let winnerId = null;
  if (p1Score > p2Score) winnerId = match.player1Id;
  else if (p2Score > p1Score) winnerId = match.player2Id;
  // If draw, winnerId remains null

  await prisma.$transaction(async (tx) => {
    // 1. Update Match
    await tx.match.update({
      where: { id: matchId },
      data: {
        status: 'COMPLETED',
        player1Score: p1Score,
        player2Score: p2Score,
        winnerId
      }
    });

    // 2. Update Standings Engine
    const gameSlug = match.tournament.game.slug;
    const rules = SCORING_RULES[gameSlug as keyof typeof SCORING_RULES] || SCORING_RULES.fc26;

    if (match.player1Id && match.player2Id) {
      const p1Points = p1Score > p2Score ? rules.win : (p1Score === p2Score ? rules.draw : rules.loss);
      const p2Points = p2Score > p1Score ? rules.win : (p1Score === p2Score ? rules.draw : rules.loss);

      await updateStanding(tx, match.tournamentId, match.player1Id, p1Points, p1Score > p2Score, p1Score === p2Score);
      await updateStanding(tx, match.tournamentId, match.player2Id, p2Points, p2Score > p1Score, p1Score === p2Score);
    }
    
    // 3. (Optional) Propagate winner to next round in Single Elim...
    // Advanced logic required to find the next match node.
  });
}

async function updateStanding(tx: any, tournamentId: string, userId: string, points: number, isWin: boolean, isDraw: boolean) {
  const standing = await tx.standing.findFirst({
    where: { tournamentId, userId }
  });

  if (standing) {
    await tx.standing.update({
      where: { id: standing.id },
      data: {
        matchesPlayed: { increment: 1 },
        wins: { increment: isWin ? 1 : 0 },
        draws: { increment: isDraw ? 1 : 0 },
        losses: { increment: (!isWin && !isDraw) ? 1 : 0 },
        points: { increment: points }
      }
    });
  } else {
    await tx.standing.create({
      data: {
        tournamentId,
        userId,
        rank: 0, // Recalculate ranks globally later
        matchesPlayed: 1,
        wins: isWin ? 1 : 0,
        draws: isDraw ? 1 : 0,
        losses: (!isWin && !isDraw) ? 1 : 0,
        points: points
      }
    });
  }
}
