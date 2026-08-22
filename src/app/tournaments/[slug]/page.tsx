'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTelegram } from '@/components/TelegramProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Calendar, Clock, Star, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TournamentBracket } from '@/components/TournamentBracket';
import { getTournament } from '@/app/actions';

export default function TournamentPage() {
  const params = useParams();
  const router = useRouter();
  const { initData, isReady } = useTelegram();
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  useEffect(() => {
    getTournament(params.slug as string)
      .then(t => {
        setTournament(t);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
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

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse font-display text-2xl font-bold text-primary">LOADING...</div></div>;
  if (!tournament) return <div className="text-center mt-20 font-display text-xl">Tournament not found</div>;

  if (status === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center space-y-6">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-4 box-glow border border-green-500/50">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-4xl font-display font-black italic uppercase text-glow">You're IN!</h1>
        <p className="text-muted-foreground max-w-sm">
          Your registration for <strong className="text-primary">{tournament.name}</strong> is confirmed.
        </p>
        <Card className="w-full bg-glass border-primary/30">
          <CardContent className="p-4 flex flex-col space-y-3">
             <div className="flex justify-between items-center text-sm">
               <span className="text-muted-foreground font-bold uppercase">Status</span>
               <Badge className="bg-green-500/20 text-green-500 border-0">Confirmed</Badge>
             </div>
          </CardContent>
        </Card>
        <Button className="w-full font-display font-bold uppercase text-lg h-12" size="lg">Join Match Discord</Button>
        <Button variant="ghost" className="w-full uppercase font-bold text-xs tracking-widest" onClick={() => router.push('/')}>Back to Hub</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-32">
      
      {/* Hero Header */}
      <div className="relative bg-secondary/50 pt-12 pb-8 px-6 border-b border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        <Badge variant="outline" className="mb-4 border-primary text-primary bg-primary/10 tracking-widest uppercase">
          {tournament.game.name}
        </Badge>
        <h1 className="text-3xl font-display font-black uppercase italic leading-tight mb-2 text-glow">{tournament.name}</h1>
        
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center text-sm font-medium">
            <Trophy className="w-4 h-4 mr-1 text-primary" />
            <span className="text-foreground">{tournament.prizePool}</span>
          </div>
          <div className="flex items-center text-sm font-medium">
            <Users className="w-4 h-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{tournament.currentPlayers}/{tournament.maxPlayers}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-glass border-white/5">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
              <Calendar className="w-6 h-6 text-primary mb-1" />
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Registration Closes</span>
              <span className="text-sm font-bold">{new Date(tournament.registrationEnd).toLocaleDateString()}</span>
            </CardContent>
          </Card>
          <Card className="bg-glass border-white/5">
            <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
              <Clock className="w-6 h-6 text-primary mb-1" />
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Tournament Starts</span>
              <span className="text-sm font-bold">{new Date(tournament.startTime).toLocaleDateString()}</span>
            </CardContent>
          </Card>
        </div>

        {/* Rules */}
        <div>
          <h3 className="text-lg font-display font-bold uppercase mb-2 tracking-wider">Tournament Rules</h3>
          <Card className="bg-background/40 border-white/5">
            <CardContent className="p-4 text-sm text-muted-foreground leading-relaxed">
              {tournament.rules || 'Standard rules apply. Good luck and have fun!'}
            </CardContent>
          </Card>
        </div>

        {/* Bracket */}
        <div>
          <h3 className="text-lg font-display font-bold uppercase mb-2 tracking-wider">Live Bracket</h3>
          <TournamentBracket />
        </div>

      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-primary/20 z-40">
        {status === 'ERROR' && (
          <div className="mb-2 p-2 bg-destructive/20 text-destructive text-xs font-bold rounded flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 mr-1" /> Payment failed or canceled.
          </div>
        )}
        <Button 
          className="w-full h-14 text-lg font-display font-black italic uppercase tracking-widest shadow-lg shadow-primary/20 box-glow rounded-xl" 
          disabled={registering}
          onClick={handleRegister}
        >
          {registering ? 'Processing...' : (
             <>REGISTER NOW <span className="mx-2 opacity-50">|</span> {tournament.entryFeeStars} <Star className="w-5 h-5 ml-1 fill-yellow-500 text-yellow-500" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
