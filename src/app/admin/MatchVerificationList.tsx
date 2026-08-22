'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { resolveMatch } from '@/app/actions';
import { CheckCircle2, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MatchVerificationList({ initialMatches }: { initialMatches: any[] }) {
  const router = useRouter();
  const [matches, setMatches] = useState(initialMatches);
  const [processing, setProcessing] = useState<string | null>(null);

  const handleResolve = async (matchId: string, action: 'APPROVE' | 'REJECT', player1Score: number, player2Score: number, p1Id: string, p2Id: string) => {
    setProcessing(matchId);
    
    let status = '';
    let winnerId = null;

    if (action === 'APPROVE') {
      status = 'COMPLETED';
      winnerId = player1Score > player2Score ? p1Id : p2Id;
    } else {
      status = 'DISPUTED';
    }

    const res = await resolveMatch(matchId, status, winnerId || undefined);
    if (res) {
      setMatches(matches.filter(m => m.id !== matchId));
      router.refresh();
    }
    setProcessing(null);
  };

  if (matches.length === 0) {
    return (
      <Card className="bg-[#0d1412] border-white/5">
        <CardContent className="p-12 text-center text-gray-500 font-medium">
          No pending match verifications.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map(match => (
        <Card key={match.id} className="bg-[#0d1412] border-yellow-500/20 box-glow overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-center p-4">
              
              <div className="flex-1 w-full mb-4 md:mb-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50 uppercase text-[10px]">Pending Verification</Badge>
                  <span className="text-xs text-muted-foreground uppercase">{match.tournament.name}</span>
                </div>
                
                <div className="flex justify-center md:justify-start items-center space-x-4">
                  <div className="text-right">
                    <p className="font-bold">{match.player1?.firstName || 'P1'}</p>
                    <p className="text-2xl font-black text-white">{match.player1Score}</p>
                  </div>
                  <div className="text-muted-foreground/30 font-black italic">VS</div>
                  <div className="text-left">
                    <p className="font-bold">{match.player2?.firstName || 'P2'}</p>
                    <p className="text-2xl font-black text-white">{match.player2Score}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                {match.evidenceUrl && (
                  <Button 
                    variant="outline" 
                    className="border-white/10 text-muted-foreground bg-black/50" 
                    onClick={() => window.open(match.evidenceUrl, '_blank', 'noopener,noreferrer')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" /> Evidence
                  </Button>
                )}
                <Button 
                  className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50"
                  disabled={processing === match.id}
                  onClick={() => handleResolve(match.id, 'APPROVE', match.player1Score, match.player2Score, match.player1Id, match.player2Id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Button 
                  className="bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50"
                  disabled={processing === match.id}
                  onClick={() => handleResolve(match.id, 'REJECT', match.player1Score, match.player2Score, match.player1Id, match.player2Id)}
                >
                  <XCircle className="w-4 h-4 mr-2" /> Reject (Dispute)
                </Button>
              </div>
              
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
