'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Trophy, Swords, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchProps {
  player1: string | null;
  player2: string | null;
  score1?: number;
  score2?: number;
  winner?: string;
  isCompleted?: boolean;
}

interface RoundProps {
  title: string;
  matches: MatchProps[];
}

interface TournamentBracketProps {
  matches?: any[];
}

export function TournamentBracket({ matches }: TournamentBracketProps) {
  const rounds: RoundProps[] = [
    {
      title: 'Quarterfinals',
      matches: [
        { player1: 'Shadow_V', player2: 'Apex_Nova', score1: 3, score2: 1, winner: 'Shadow_V', isCompleted: true },
        { player1: 'GhostRider', player2: 'Phantom99', score1: 2, score2: 2, isCompleted: false },
        { player1: 'ViperX', player2: 'Striker_FC', score1: 0, score2: 3, winner: 'Striker_FC', isCompleted: true },
        { player1: 'BlitzKrieg', player2: 'CyberDash', score1: 1, score2: 0, winner: 'BlitzKrieg', isCompleted: true },
      ]
    },
    {
      title: 'Semifinals',
      matches: [
        { player1: 'Shadow_V', player2: 'GhostRider', isCompleted: false },
        { player1: 'Striker_FC', player2: 'BlitzKrieg', score1: 2, score2: 1, winner: 'Striker_FC', isCompleted: true },
      ]
    },
    {
      title: 'Grand Finals',
      matches: [
        { player1: 'TBD', player2: 'Striker_FC', isCompleted: false },
      ]
    }
  ];

  return (
    <ScrollArea className="w-full bg-[#08100e]/80 rounded-2xl border border-cyan-500/20 p-4 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
      <div className="flex space-x-8 min-w-max pb-3">
        {rounds.map((round, rIndex) => (
          <div key={rIndex} className="flex flex-col space-y-4 justify-around min-w-[200px]">
            <div className="flex items-center justify-center space-x-1.5 mb-1">
              {rIndex === rounds.length - 1 ? (
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Swords className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <h4 className={cn(
                "text-xs font-black uppercase tracking-widest text-center",
                rIndex === rounds.length - 1 ? "text-amber-400" : "text-cyan-400"
              )}>
                {round.title}
              </h4>
            </div>

            {round.matches.map((match, mIndex) => (
              <Card 
                key={mIndex} 
                className="bg-card/90 border-white/10 shadow-lg flex flex-col overflow-hidden text-xs relative rounded-xl border hover:border-cyan-500/40 transition-all"
              >
                {/* Player 1 Row */}
                <div className={cn(
                  "p-2.5 flex justify-between items-center border-b border-white/5",
                  match.winner === match.player1 && match.player1 !== null 
                    ? "bg-cyan-950/60 text-cyan-300 font-extrabold" 
                    : (match.isCompleted && match.winner !== match.player1 ? "opacity-40 text-muted-foreground" : "font-medium text-foreground")
                )}>
                  <span className="truncate max-w-[130px]">{match.player1 || 'TBD'}</span>
                  {match.isCompleted ? (
                    <span className="font-mono font-black text-cyan-400">{match.score1 ?? '-'}</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground font-mono">READY</span>
                  )}
                </div>

                {/* Player 2 Row */}
                <div className={cn(
                  "p-2.5 flex justify-between items-center",
                  match.winner === match.player2 && match.player2 !== null 
                    ? "bg-cyan-950/60 text-cyan-300 font-extrabold" 
                    : (match.isCompleted && match.winner !== match.player2 ? "opacity-40 text-muted-foreground" : "font-medium text-foreground")
                )}>
                  <span className="truncate max-w-[130px]">{match.player2 || 'TBD'}</span>
                  {match.isCompleted ? (
                    <span className="font-mono font-black text-cyan-400">{match.score2 ?? '-'}</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground font-mono">READY</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
