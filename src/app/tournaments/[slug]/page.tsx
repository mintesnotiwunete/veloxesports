'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTelegram } from '@/components/TelegramProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar, Clock, Star, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TournamentBracket } from '@/components/TournamentBracket';

export default function TournamentPage() {
  const params = useParams();
  const router = useRouter();
  const { initData, isReady } = useTelegram();
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  useEffect(() => {
    setTimeout(() => {
      setTournament({
        id: 'cm02vnt3h000008lc6w230z9g', 
        name: 'Winter Clash 2026',
        game: { name: 'Fortnite' },
        status: 'REGISTRATION_OPEN',
        entryFeeStars: 50,
        prizePool: '$5000',
        maxPlayers: 256,
        currentPlayers: 128,
        registrationEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        rules: 'Standard Battle Royale rules apply. Top 10 advance to finals.'
      });
      setLoading(false);
    }, 500);
  }, [params.slug]);

  const handleRegister = async () => {
    if (!initData) {
      alert('Please open this app inside Telegram to register.');
      return;
    }

    setRegistering(true);
    setStatus('IDLE');

    try {
      const res = await fetch('/api/payments/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData, tournamentId: tournament.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      
      if (data.isFree) {
        setStatus('SUCCESS');
        return;
      }
      
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openInvoice(data.invoiceUrl, (status: string) => {
          if (status === 'paid') setStatus('SUCCESS');
          else setStatus('ERROR');
          setRegistering(false);
        });
      } else {
        setStatus('SUCCESS');
        setRegistering(false);
      }
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
      setRegistering(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse font-bold">Loading...</div></div>;
  if (!tournament) return <div>Tournament not found</div>;

  if (status === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center space-y-6">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-black italic uppercase">You're IN!</h1>
        <p className="text-muted-foreground max-w-sm">
          Your registration for <strong className="text-foreground">{tournament.name}</strong> is confirmed.
        </p>
        <Card className="w-full bg-card/50 border-border/50">
          <CardContent className="p-4 flex flex-col space-y-3">
             <div className="flex justify-between items-center text-sm">
               <span className="text-muted-foreground">Status</span>
               <Badge className="bg-green-500/20 text-green-500 border-0">Confirmed</Badge>
             </div>
          </CardContent>
        </Card>
        <Button className="w-full font-bold" size="lg">Join Tournament Discord</Button>
        <Button variant="ghost" className="w-full" onClick={() => router.push('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <div className="h-48 bg-gradient-to-br from-primary/40 to-destructive/40 relative flex items-end p-4">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full">
          <Badge className="mb-2 bg-white/20 text-white border-0 backdrop-blur-md">{tournament.game.name}</Badge>
          <h1 className="text-3xl font-black italic tracking-tight text-white shadow-black drop-shadow-md">{tournament.name}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-4 relative z-20">
        <Card className="border-border/50 shadow-lg bg-card/80 backdrop-blur-xl">
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Prize Pool</p>
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-bold">{tournament.prizePool}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Players</p>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-bold">{tournament.currentPlayers} / {tournament.maxPlayers}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h3 className="text-lg font-bold flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-primary" />
            Bracket
          </h3>
          <TournamentBracket />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-bold flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-primary" />
            Tournament Rules
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/50">
            {tournament.rules}
          </p>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border">
        <Button 
          className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20" 
          disabled={registering}
          onClick={handleRegister}
        >
          {registering ? 'Processing...' : (
             <>REGISTER NOW - {tournament.entryFeeStars} <Star className="w-5 h-5 ml-1 fill-yellow-500 text-yellow-500" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
