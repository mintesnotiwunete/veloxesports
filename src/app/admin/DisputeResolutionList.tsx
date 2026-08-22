'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertOctagon, CheckCircle2, Search, ExternalLink } from 'lucide-react';
import { resolveMatch } from '@/app/actions';
import { triggerHaptic } from '@/lib/haptics';

export function DisputeResolutionList({ initialMatches }: { initialMatches: any[] }) {
  const [matches, setMatches] = useState(initialMatches);
  const [resolving, setResolving] = useState<string | null>(null);

  const handleResolve = async (matchId: string, winnerId: string) => {
    setResolving(matchId);
    const res = await resolveMatch(matchId, 'COMPLETED', winnerId);
    if (res) {
      triggerHaptic('success');
      setMatches(prev => prev.filter(m => m.id !== matchId));
    } else {
      triggerHaptic('error');
    }
    setResolving(null);
  };

  const handleCancelMatch = async (matchId: string) => {
    setResolving(matchId);
    const res = await resolveMatch(matchId, 'CANCELLED', undefined);
    if (res) {
      triggerHaptic('success');
      setMatches(prev => prev.filter(m => m.id !== matchId));
    } else {
      triggerHaptic('error');
    }
    setResolving(null);
  };

  if (matches.length === 0) {
    return (
      <Card className="bg-glass border-white/5 border-dashed">
        <CardContent className="p-8 text-center flex flex-col items-center">
          <AlertOctagon className="w-8 h-8 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-bold text-muted-foreground">No Disputed Matches</p>
          <p className="text-xs text-muted-foreground mt-1">All disputes have been resolved.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map(match => (
        <Card key={match.id} className="bg-red-950/20 border-red-500/30 overflow-hidden box-glow relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">{match.tournament?.name}</p>
                <h3 className="text-sm font-display font-black text-white mt-0.5">Disputed Match</h3>
              </div>
              <div className="bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-1 rounded-sm flex items-center">
                <AlertOctagon className="w-3 h-3 mr-1" /> Requires Action
              </div>
            </div>

            <div className="flex items-center justify-between bg-black/40 rounded-xl p-3 mb-4">
              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground uppercase font-bold">Player 1</p>
                <p className="text-sm font-black text-white">{match.player1?.firstName}</p>
                <p className="text-xs text-cyan-400">Claimed: {match.player1Score}</p>
                <Button 
                  size="sm" 
                  onClick={() => handleResolve(match.id, match.player1Id)}
                  disabled={resolving === match.id}
                  className="mt-2 w-full h-7 text-[10px] font-bold uppercase bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900 border border-cyan-500/30"
                >
                  Force P1 Win
                </Button>
              </div>
              
              <div className="px-4 flex flex-col items-center">
                <span className="text-xs font-black text-red-500 uppercase tracking-widest">VS</span>
                {match.evidenceUrl && (
                  <a href={match.evidenceUrl} target="_blank" rel="noreferrer" className="mt-2 text-[10px] flex items-center text-blue-400 hover:underline">
                    <Search className="w-3 h-3 mr-1" /> Evidence
                  </a>
                )}
              </div>
              
              <div className="text-center flex-1">
                <p className="text-xs text-muted-foreground uppercase font-bold">Player 2</p>
                <p className="text-sm font-black text-white">{match.player2?.firstName}</p>
                <p className="text-xs text-cyan-400">Claimed: {match.player2Score}</p>
                <Button 
                  size="sm" 
                  onClick={() => handleResolve(match.id, match.player2Id)}
                  disabled={resolving === match.id}
                  className="mt-2 w-full h-7 text-[10px] font-bold uppercase bg-cyan-950/40 text-cyan-400 hover:bg-cyan-900 border border-cyan-500/30"
                >
                  Force P2 Win
                </Button>
              </div>
            </div>

            <Button 
              variant="outline"
              size="sm"
              onClick={() => handleCancelMatch(match.id)}
              disabled={resolving === match.id}
              className="w-full text-xs font-bold text-red-500 border-red-500/30 hover:bg-red-950/30"
            >
              Cancel Match (Draw / Refund)
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
