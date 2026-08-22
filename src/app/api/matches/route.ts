import { NextResponse } from 'next/server';
import { submitMatchResult } from '@/lib/tournament-engine';

export async function POST(req: Request) {
  try {
    const { matchId, p1Score, p2Score } = await req.json();

    if (!matchId || typeof p1Score !== 'number' || typeof p2Score !== 'number') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // In a real app, verify admin session or match participant here
    
    await submitMatchResult(matchId, p1Score, p2Score);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
