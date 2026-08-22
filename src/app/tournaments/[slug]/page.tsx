'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTelegram } from '@/components/TelegramProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle2, 
  ShieldAlert, 
  Share2, 
  Swords, 
  ScrollText, 
  MessageSquare,
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TournamentBracket } from '@/components/TournamentBracket';
import { getTournament } from '@/app/actions';
import { triggerHaptic } from '@/lib/haptics';

export default function TournamentPage() {
  const params = useParams();
  const router = useRouter();
  const { initData, isReady } = useTelegram();
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [activeTab, setActiveTab] = useState<'overview' | 'bracket' | 'rules' | 'squad'>('overview');
  const [copied, setCopied] = useState(false);

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
    triggerHaptic('medium');

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
        triggerHaptic('success');
        setStatus('SUCCESS');
        return;
      }
      
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.openInvoice) {
        (window as any).Telegram.WebApp.openInvoice(data.invoiceUrl, (status: string) => {
          if (status === 'paid') {
            triggerHaptic('success');
            setStatus('SUCCESS');
          } else {
            triggerHaptic('error');
            setStatus('ERROR');
          }
          setRegistering(false);
        });
      } else {
        triggerHaptic('success');
        setStatus('SUCCESS');
        setRegistering(false);
      }
    } catch (error) {
      console.error(error);
      triggerHaptic('error');
      setStatus('ERROR');
      setRegistering(false);
    }
  };

  const handleShareSquad = () => {
    triggerHaptic('selection');
    const shareText = `⚔️ Join me in ${tournament?.name} (${tournament?.game?.name}) on Velox Esports! Prize pool: ${tournament?.prizePool || '$1,000'}.`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(`https://t.me/veloxesportsbot/app?startapp=${tournament?.slug}`)}&text=${encodeURIComponent(shareText)}`;

    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.openTelegramLink) {
      (window as any).Telegram.WebApp.openTelegramLink(shareUrl);
    } else {
      navigator.clipboard?.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-3">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">Loading Arena Data...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-4">
        <Trophy className="w-12 h-12 text-muted-foreground opacity-40" />
        <h2 className="text-xl font-display font-black uppercase">Tournament Not Found</h2>
        <Button onClick={() => router.push('/tournaments')} variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase">
          Back to Tournaments
        </Button>
      </div>
    );
  }

  if (status === 'SUCCESS') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] p-6 text-center space-y-5 max-w-md mx-auto">
        <div className="w-20 h-20 bg-emerald-950/60 rounded-3xl flex items-center justify-center border-2 border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.4)] animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>

        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">Registration Confirmed</span>
          <h1 className="text-3xl font-display font-black uppercase text-foreground mt-1">You Are In The Arena!</h1>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            You are officially registered for <strong className="text-cyan-400">{tournament.name}</strong>.
          </p>
        </div>

        <Card className="w-full bg-card/80 border-cyan-500/30 rounded-2xl shadow-lg">
          <CardContent className="p-4 space-y-3 text-left">
            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
              <span className="text-muted-foreground font-semibold">Tournament</span>
              <span className="font-bold text-foreground">{tournament.name}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
              <span className="text-muted-foreground font-semibold">Game Title</span>
              <span className="font-bold text-cyan-400">{tournament.game?.name}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-semibold">Entry Stars</span>
              <span className="font-mono font-black text-amber-400 flex items-center gap-1">⭐ {tournament.entryFeeStars} Paid</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2 w-full pt-2">
          <Button 
            onClick={handleShareSquad}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-display font-black uppercase tracking-wider text-sm h-12 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share with Squad
          </Button>
          <Button 
            variant="ghost" 
            className="w-full uppercase font-bold text-xs tracking-widest text-muted-foreground hover:text-foreground" 
            onClick={() => router.push('/')}
          >
            Return to Hub
          </Button>
        </div>
      </div>
    );
  }

  const registeredCount = tournament._count?.registrations ?? tournament.currentPlayers ?? 0;
  const maxPlayers = tournament.maxPlayers || 64;

  return (
    <div className="flex flex-col min-h-screen pb-28 max-w-lg mx-auto">
      {/* Top Header Bar */}
      <div className="p-4 flex items-center justify-between">
        <button 
          onClick={() => { triggerHaptic('light'); router.push('/tournaments'); }}
          className="p-2 rounded-xl bg-card/60 border border-white/10 hover:border-cyan-500/30 text-muted-foreground hover:text-foreground transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShareSquad}
            className="flex items-center space-x-1.5 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied Link' : 'Invite Squad'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="px-4">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0e1816] via-card to-[#091110] border border-cyan-500/30 p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                {tournament.game?.name}
              </span>
              <div className="flex items-center space-x-1.5 bg-yellow-950/60 border border-yellow-500/40 px-3 py-1 rounded-full">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-black text-yellow-400 tracking-wide">{tournament.prizePool || '$1,000'}</span>
              </div>
            </div>

            <h1 className="text-2xl font-display font-black uppercase tracking-wide text-foreground">
              {tournament.name}
            </h1>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
              <div className="flex items-center space-x-2 text-xs">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-muted-foreground font-semibold">{registeredCount} / {maxPlayers} Registered</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-foreground font-bold">Entry: {tournament.entryFeeStars} Stars</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-4 gap-1 p-1 bg-card/60 rounded-xl border border-white/5 text-center">
          {[
            { id: 'overview', label: 'Overview', icon: Trophy },
            { id: 'bracket', label: 'Bracket', icon: Swords },
            { id: 'rules', label: 'Rules', icon: ScrollText },
            { id: 'squad', label: 'Squad', icon: Share2 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => { triggerHaptic('selection'); setActiveTab(tab.id as any); }}
                className={`py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-black font-extrabold shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-4">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="bg-card/80 border-white/10 rounded-2xl">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                  <Calendar className="w-5 h-5 text-cyan-400 mb-1" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Registration Closes</span>
                  <span className="text-xs font-bold text-foreground">
                    {tournament.registrationEnd ? new Date(tournament.registrationEnd).toLocaleDateString() : 'Active'}
                  </span>
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-white/10 rounded-2xl">
                <CardContent className="p-4 flex flex-col items-center text-center space-y-1">
                  <Clock className="w-5 h-5 text-cyan-400 mb-1" />
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Match Time</span>
                  <span className="text-xs font-bold text-foreground">
                    {tournament.startTime ? new Date(tournament.startTime).toLocaleDateString() : 'Live'}
                  </span>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/80 border-white/10 rounded-2xl">
              <CardContent className="p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">About This Event</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tournament.description || 'Compete in high-stakes competitive esports brackets. Fast score confirmations, automatic Telegram Stars rewards, and community leaderboard standing.'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* BRACKET TAB */}
        {activeTab === 'bracket' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Live Bracket Tree</h3>
              <span className="text-[10px] text-muted-foreground font-mono">Single Elimination</span>
            </div>
            <TournamentBracket matches={tournament.matches} />
          </div>
        )}

        {/* RULES TAB */}
        {activeTab === 'rules' && (
          <Card className="bg-card/80 border-white/10 rounded-2xl">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Official Tournament Rules</h3>
              <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4 leading-relaxed">
                <li>Matches are played according to standard competitive rules for {tournament.game?.name}.</li>
                <li>Both players must take a screenshot of the final score screen.</li>
                <li>If an opponent fails to show up within 10 minutes, submit a forfeit claim via Discord.</li>
                <li>Prizes in Telegram Stars are distributed instantly to your Telegram wallet upon final verification.</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* SQUAD TAB */}
        {activeTab === 'squad' && (
          <Card className="bg-gradient-to-b from-cyan-950/30 to-card border-cyan-500/30 rounded-2xl text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto">
              <Share2 className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-black text-lg uppercase text-foreground">Invite Squad Mates</h3>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Share this tournament with your friends or esports team directly in Telegram chats!
              </p>
            </div>
            <Button 
              onClick={handleShareSquad}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase tracking-wider text-xs h-11 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              {copied ? 'Link Copied!' : '🚀 Send Telegram Invite'}
            </Button>
          </Card>
        )}
      </div>

      {/* Floating Bottom Registration Action */}
      <div className="fixed bottom-16 left-0 right-0 p-4 max-w-lg mx-auto z-40">
        <div className="bg-[#0b1311]/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-3 shadow-[0_0_25px_rgba(6,182,212,0.25)] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest block">Entry Fee</span>
            <span className="font-mono text-sm font-black text-cyan-400 flex items-center gap-1">
              ⭐ {tournament.entryFeeStars} <span className="text-[10px] text-muted-foreground font-sans">Stars</span>
            </span>
          </div>

          <Button 
            className="flex-1 h-11 bg-cyan-500 hover:bg-cyan-400 text-black font-display font-black uppercase tracking-wider text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            disabled={registering}
            onClick={handleRegister}
          >
            {registering ? 'Processing Invoice...' : 'Join Tournament Now'}
          </Button>
        </div>
      </div>
    </div>
  );
}
