'use client';

import { useEffect, useState } from 'react';
import { useTelegram } from '@/components/TelegramProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Swords, Clock, AlertTriangle, Upload, ChevronLeft, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { getMatchById, submitMatchResult } from '@/app/actions';
import { triggerHaptic } from '@/lib/haptics';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MatchRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useTelegram();
  const [mounted, setMounted] = useState(false);
  const [match, setMatch] = useState<any>(null);
  
  const [p1Score, setP1Score] = useState('');
  const [p2Score, setP2Score] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (params.id) {
      getMatchById(params.id as string).then(setMatch).catch(console.error);
    }
  }, [params.id]);

  if (!mounted || !match) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Match Room...</div>;

  const isPlayer1 = user?.id === match.player1?.id || match.player1?.telegramUsername === user?.username;
  const isPlayer2 = user?.id === match.player2?.id || match.player2?.telegramUsername === user?.username;
  const isParticipant = isPlayer1 || isPlayer2;

  const handleSubmitScore = async () => {
    if (!p1Score || !p2Score) return;
    setSubmitting(true);
    triggerHaptic('medium');
    
    // In a real app, evidenceUrl would be an image uploaded to Supabase Storage.
    // For MVP, we'll just mock the evidence URL.
    const mockEvidence = 'https://picsum.photos/400/300';
    
    // For MVP we assume we have user DB id. Since useTelegram gives tg initData, we might need a mapping.
    // Assuming `user.id` is available (it's actually telegramId in initData).
    // Let's just use match.player1.id or match.player2.id depending on who is logged in.
    const submitterId = isPlayer1 ? match.player1?.id : match.player2?.id;

    const res = await submitMatchResult(match.id, parseInt(p1Score), parseInt(p2Score), mockEvidence, submitterId);
    if (res) {
      triggerHaptic('success');
      setMatch({ ...match, status: 'SUBMITTED', player1Score: parseInt(p1Score), player2Score: parseInt(p2Score) });
    }
    setSubmitting(false);
  };

  return (
    <div className="p-4 pt-8 pb-24 max-w-md mx-auto min-h-screen space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-glass">
          <ChevronLeft className="w-5 h-5 text-primary" />
        </Button>
        <div>
          <h1 className="text-xl font-display font-black uppercase italic">Match Room</h1>
          <p className="text-xs text-muted-foreground">{match.tournament.name}</p>
        </div>
      </div>

      <Card className="bg-glass border-white/5 box-glow p-6 text-center">
        <Badge className="mb-4 bg-primary/20 text-primary uppercase text-[10px] tracking-wider border-primary/50">
          {match.status}
        </Badge>
        
        <div className="flex justify-between items-center mb-6">
          {/* Player 1 */}
          <div className="flex flex-col items-center flex-1">
            <Avatar className={`h-16 w-16 border-2 ${isPlayer1 ? 'border-primary box-glow' : 'border-white/10'}`}>
              <AvatarImage src={match.player1?.avatarUrl} />
              <AvatarFallback>{match.player1?.firstName?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold mt-2">{match.player1?.firstName || 'TBD'}</span>
            <span className="text-[10px] text-primary">@{(match.player1?.telegramUsername || 'unknown')}</span>
          </div>

          <div className="px-4 font-black italic text-2xl text-muted-foreground/30">VS</div>

          {/* Player 2 */}
          <div className="flex flex-col items-center flex-1">
            <Avatar className={`h-16 w-16 border-2 ${isPlayer2 ? 'border-primary box-glow' : 'border-white/10'}`}>
              <AvatarImage src={match.player2?.avatarUrl} />
              <AvatarFallback>{match.player2?.firstName?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold mt-2">{match.player2?.firstName || 'TBD'}</span>
            <span className="text-[10px] text-primary">@{(match.player2?.telegramUsername || 'unknown')}</span>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground bg-black/40 p-3 rounded-lg border border-white/5 text-left">
          <span className="font-bold text-white uppercase block mb-1">Instructions</span>
          Add your opponent in-game. The top player creates the lobby. Play the match, then return here to submit the final score.
        </div>
      </Card>

      {(match.status === 'SCHEDULED' || match.status === 'LIVE') && isParticipant && (
        <Card className="bg-glass border-white/5 p-4 box-glow">
          <h3 className="font-display font-bold uppercase mb-4 text-center">Submit Result</h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Label className="text-xs uppercase font-bold text-muted-foreground">{match.player1?.firstName} Score</Label>
              <Input 
                type="number" 
                value={p1Score} 
                onChange={(e) => setP1Score(e.target.value)} 
                className="bg-black/50 border-white/10 text-center font-black text-xl"
                placeholder="0"
              />
            </div>
            <div className="text-muted-foreground font-black">-</div>
            <div className="flex-1">
              <Label className="text-xs uppercase font-bold text-muted-foreground">{match.player2?.firstName} Score</Label>
              <Input 
                type="number" 
                value={p2Score} 
                onChange={(e) => setP2Score(e.target.value)} 
                className="bg-black/50 border-white/10 text-center font-black text-xl"
                placeholder="0"
              />
            </div>
          </div>

          <Button variant="outline" className="w-full mb-4 bg-black/40 border-dashed border-white/20 text-muted-foreground hover:text-white">
            <Upload className="w-4 h-4 mr-2" /> Upload Screenshot Evidence
          </Button>

          <Button 
            className="w-full bg-primary text-primary-foreground font-bold uppercase tracking-wider" 
            onClick={handleSubmitScore}
            disabled={!p1Score || !p2Score || submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Final Score'}
          </Button>
        </Card>
      )}

      {match.status === 'SUBMITTED' && (
        <Card className="bg-yellow-500/10 border-yellow-500/30 p-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
          <h3 className="font-bold text-yellow-500 uppercase">Score Under Review</h3>
          <p className="text-sm text-yellow-500/70 mt-2">
            The submitted score is <strong>{match.player1Score} - {match.player2Score}</strong>. An admin will verify the result shortly.
          </p>
          {isParticipant && (
             <Button variant="outline" className="mt-4 border-red-500/50 text-red-500 hover:bg-red-500/20 uppercase text-xs font-bold" onClick={() => triggerHaptic('heavy')}>
               <AlertTriangle className="w-4 h-4 mr-2" /> Dispute Score
             </Button>
          )}
        </Card>
      )}

    </div>
  );
}
