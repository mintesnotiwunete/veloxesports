'use client';

import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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

export function TournamentBracket() {
  const rounds: RoundProps[] = [
    {
      title: 'Quarterfinals',
      matches: [
        { player1: 'ShadowX', player2: 'Nova', score1: 3, score2: 1, winner: 'ShadowX', isCompleted: true },
        { player1: 'Ghost', player2: 'Phantom', score1: 2, score2: 2, isCompleted: false },
        { player1: 'Viper', player2: 'Striker', score1: 0, score2: 3, winner: 'Striker', isCompleted: true },
        { player1: 'Blitz', player2: 'Dash', score1: 1, score2: 0, winner: 'Blitz', isCompleted: true },
      ]
    },
    {
      title: 'Semifinals',
      matches: [
        { player1: 'ShadowX', player2: 'Ghost', isCompleted: false },
        { player1: 'Striker', player2: 'Blitz', score1: 2, score2: 1, winner: 'Striker', isCompleted: true },
      ]
    },
    {
      title: 'Finals',
      matches: [
        { player1: null, player2: 'Striker', isCompleted: false },
      ]
    }
  ];

  return (
    <ScrollArea className="w-full bg-background/50 rounded-xl border border-border/50 p-4">
      <div className="flex space-x-12 min-w-max pb-4">
        {rounds.map((round, rIndex) => (
          <div key={rIndex} className="flex flex-col space-y-6 justify-around">
            <h4 className="text-sm font-bold text-muted-foreground text-center mb-2 uppercase tracking-widest">
              {round.title}
            </h4>
            {round.matches.map((match, mIndex) => (
              <Card 
                key={mIndex} 
                className="w-48 bg-card border-border/50 shadow-md flex flex-col overflow-hidden text-sm relative"
              >
                {rIndex > 0 && (
                  <div className="absolute -left-6 top-1/2 w-6 h-px bg-border/50" />
                )}
                {rIndex < rounds.length - 1 && (
                  <div className="absolute -right-6 top-1/2 w-6 h-px bg-border/50" />
                )}

                <div className={cn(
                  "p-2 flex justify-between items-center border-b border-border/50",
                  match.winner === match.player1 && match.player1 !== null ? "bg-primary/10 text-primary font-bold" : 
                  (match.isCompleted && match.winner !== match.player1 ? "opacity-50" : "font-medium")
                )}>
                  <span className="truncate">{match.player1 || 'TBD'}</span>
                  {match.isCompleted && <span>{match.score1 ?? '-'}</span>}
                </div>
                <div className={cn(
                  "p-2 flex justify-between items-center",
                  match.winner === match.player2 && match.player2 !== null ? "bg-primary/10 text-primary font-bold" : 
                  (match.isCompleted && match.winner !== match.player2 ? "opacity-50" : "font-medium")
                )}>
                  <span className="truncate">{match.player2 || 'TBD'}</span>
                  {match.isCompleted && <span>{match.score2 ?? '-'}</span>}
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
