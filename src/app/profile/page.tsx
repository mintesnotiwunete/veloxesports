'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTelegram } from '@/components/TelegramProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Share2, 
  DiscIcon as Discord, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { getUserPassport, getAllGames, linkGameProfile } from '@/app/actions';
import { triggerHaptic } from '@/lib/haptics';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfilePage() {
  const { user } = useTelegram();
  const [userData, setUserData] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'achievements' | 'history'>('achievements');
  const [copied, setCopied] = useState(false);
  const [linkingGame, setLinkingGame] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [gameUsername, setGameUsername] = useState('');

  useEffect(() => {
    if (user?.id) {
      getUserPassport(user.id).then(setUserData).catch(console.error);
    }
    getAllGames().then(setGames).catch(console.error);
  }, [user?.id]);

  const handleLinkGame = async () => {
    if (!selectedGameId || !gameUsername || !user?.id) return;
    triggerHaptic('medium');
    const res = await linkGameProfile(user.id, selectedGameId, gameUsername);
    if (res) {
      triggerHaptic('success');
      setLinkingGame(false);
      setGameUsername('');
      getUserPassport(user.id).then(setUserData).catch(console.error);
    }
  };

  const registrations = userData?.registrations || [];
  const tournamentsCount = registrations.length;
  const winsCount = userData?.standings?.filter((s: any) => s.rank === 1)?.length || 0;
  const starsSpent = userData?.payments?.reduce((acc: number, p: any) => acc + (p.amountStars || 0), 0) || 0;

  // Achievements Definition
  const achievements = [
    {
      id: 'first_blood',
      name: 'First Blood',
      desc: 'Register for your first esports tournament',
      unlocked: tournamentsCount >= 1,
      icon: Flame,
      color: 'text-orange-400 bg-orange-950/40 border-orange-500/30'
    },
    {
      id: 'stars_spender',
      name: 'Stars Contender',
      desc: 'Compete in events using Telegram Stars',
      unlocked: starsSpent > 0 || tournamentsCount >= 1,
      icon: Zap,
      color: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30'
    },
    {
      id: 'champion',
      name: 'Apex Champion',
      desc: 'Claim 1st place in an official Velox tournament',
      unlocked: winsCount >= 1,
      icon: Trophy,
      color: 'text-amber-400 bg-amber-950/40 border-amber-500/30'
    },
    {
      id: 'verified',
      name: 'Verified Gladiator',
      desc: 'Link your Discord identity to Velox',
      unlocked: Boolean(userData?.discordAccount),
      icon: ShieldCheck,
      color: 'text-purple-400 bg-purple-950/40 border-purple-500/30'
    }
  ];

  const handleShareProfile = () => {
    triggerHaptic('success');
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/veloxesportsbot/app')}&text=${encodeURIComponent(`🎮 Challenge me on Velox Esports! I'm competing for cash & Telegram Stars prize pools.`)}`;
    
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.openTelegramLink) {
      (window as any).Telegram.WebApp.openTelegramLink(shareUrl);
    } else {
      navigator.clipboard?.writeText('https://t.me/veloxesportsbot/app');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 pb-24 space-y-5 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center pt-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">Gamer Passport</span>
          <h1 className="text-2xl font-display font-black uppercase tracking-wider text-foreground">Player Profile</h1>
        </div>
        <button
          onClick={handleShareProfile}
          className="flex items-center space-x-1.5 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Copied!' : 'Share'}</span>
        </button>
      </header>

      {/* Main Passport Identity Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0e1816] via-card to-[#091110] border border-cyan-500/30 p-6 shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* Background circuit glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex flex-col items-center text-center space-y-3 relative z-10">
          <div className="relative">
            <Avatar className="w-20 h-20 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <AvatarImage src={user?.photo_url || userData?.avatarUrl} />
              <AvatarFallback className="text-2xl font-black bg-cyan-950 text-cyan-400">
                {user?.first_name?.charAt(0) || 'P'}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-black p-1 rounded-full border-2 border-background">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-display font-black uppercase tracking-wide text-foreground">
              {user ? `${user.first_name} ${user.last_name || ''}` : 'Guest Gladiator'}
            </h2>
            <p className="text-xs font-mono text-cyan-400 font-semibold mt-0.5">
              {user?.username ? `@${user.username}` : `ID: ${user?.id || '2026-VAL'}`}
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 shadow-sm">
              ⚡ Tier: Diamond
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30">
              ⭐ {starsSpent} Stars
            </span>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-4 gap-2 pt-5 border-t border-white/5 mt-5 text-center">
          <div className="p-2 rounded-xl bg-black/30 border border-white/5">
            <p className="text-lg font-black text-cyan-400 font-mono">{tournamentsCount}</p>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Events</p>
          </div>
          <div className="p-2 rounded-xl bg-black/30 border border-white/5">
            <p className="text-lg font-black text-yellow-400 font-mono">{winsCount}</p>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Victories</p>
          </div>
          <div className="p-2 rounded-xl bg-black/30 border border-white/5">
            <p className="text-lg font-black text-emerald-400 font-mono">
              {tournamentsCount > 0 ? `${Math.round((winsCount / tournamentsCount) * 100)}%` : '0%'}
            </p>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Win Rate</p>
          </div>
          <div className="p-2 rounded-xl bg-black/30 border border-white/5">
            <p className="text-lg font-black text-purple-400 font-mono">1,250</p>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Rating</p>
          </div>
        </div>
      </div>

      {/* Linked Game Accounts */}
      <Card className="bg-card/70 border-white/10 rounded-2xl overflow-hidden">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground">Linked Game Accounts</p>
            <Button size="sm" variant="ghost" onClick={() => setLinkingGame(!linkingGame)} className="text-[10px] uppercase font-bold text-cyan-400 p-0 h-auto hover:bg-transparent">
              {linkingGame ? 'Cancel' : '+ Add Account'}
            </Button>
          </div>

          {userData?.gameProfiles?.length > 0 && (
            <div className="space-y-2">
              {userData.gameProfiles.map((gp: any) => (
                <div key={gp.id} className="flex justify-between items-center bg-black/30 p-2 rounded-lg border border-white/5">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">{gp.game.name}</span>
                  <span className="text-xs font-mono text-cyan-400">{gp.gameUsername}</span>
                </div>
              ))}
            </div>
          )}

          {linkingGame && (
            <div className="space-y-2 bg-black/50 p-3 rounded-xl border border-cyan-500/30">
              <Select value={selectedGameId} onValueChange={(val) => setSelectedGameId(val || '')}>
                <SelectTrigger className="bg-background border-white/10 text-xs">
                  <SelectValue placeholder="Select Game" />
                </SelectTrigger>
                <SelectContent>
                  {games.map(g => (
                    <SelectItem key={g.id} value={g.id} className="text-xs">{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                placeholder="In-Game UID / Username" 
                value={gameUsername}
                onChange={e => setGameUsername(e.target.value)}
                className="bg-background border-white/10 text-xs h-9"
              />
              <Button onClick={handleLinkGame} disabled={!selectedGameId || !gameUsername} className="w-full h-8 text-xs font-bold uppercase bg-cyan-500 text-black hover:bg-cyan-400">
                Save Account
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discord Connection Status */}
      <Card className="bg-card/70 border-white/10 rounded-2xl overflow-hidden">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 flex items-center justify-center">
              <Discord className="w-5 h-5 text-[#5865F2]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">Discord Sync</p>
              <p className="text-[11px] text-muted-foreground">
                {userData?.discordAccount ? `@${userData.discordAccount.discordUsername}` : 'Required for official matches'}
              </p>
            </div>
          </div>
          
          <Link href={user?.id ? `/api/auth/discord?userId=${user.id}` : "#"} onClick={() => triggerHaptic('medium')}>
            <Button size="sm" className="bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold uppercase tracking-wider h-8 rounded-lg">
              {userData?.discordAccount ? 'Linked' : 'Connect'}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Profile Navigation Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-card/60 rounded-xl border border-white/5">
        <button
          onClick={() => { triggerHaptic('selection'); setActiveTab('achievements'); }}
          className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'achievements'
              ? 'bg-cyan-500 text-black font-extrabold shadow-md'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          🎖️ Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
        </button>
        <button
          onClick={() => { triggerHaptic('selection'); setActiveTab('history'); }}
          className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'history'
              ? 'bg-cyan-500 text-black font-extrabold shadow-md'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          📜 Match History ({registrations.length})
        </button>
      </div>

      {/* Achievements Tab Content */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((ach) => {
            const Icon = ach.icon;
            return (
              <div 
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                  ach.unlocked 
                    ? 'bg-card/90 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                    : 'bg-card/30 border-white/5 opacity-60'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${ach.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {ach.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm uppercase text-foreground">{ach.name}</h4>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{ach.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Match History Tab Content */}
      {activeTab === 'history' && (
        <div className="space-y-2.5">
          {registrations.length === 0 ? (
            <div className="text-center py-12 bg-card/30 rounded-2xl border border-white/5 p-6 space-y-2">
              <Trophy className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
              <p className="text-sm font-bold uppercase text-foreground">No Registered Tournaments</p>
              <p className="text-xs text-muted-foreground">Jump into active tournaments from the arena tab.</p>
              <Link href="/tournaments">
                <Button size="sm" className="mt-2 bg-cyan-500 text-black font-extrabold uppercase text-xs">
                  Explore Tournaments
                </Button>
              </Link>
            </div>
          ) : (
            registrations.map((reg: any) => (
              <Card key={reg.id} className="bg-card/80 border-white/10 rounded-xl overflow-hidden">
                <CardContent className="p-3.5 flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-display font-bold text-sm uppercase text-foreground">
                        {reg.tournament?.name}
                      </h4>
                      <Badge variant="outline" className="text-[9px] border-cyan-500/30 text-cyan-400">
                        {reg.tournament?.game?.name}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      Status: {reg.status} • Prize: {reg.tournament?.prizePool || '$1,000'}
                    </p>
                  </div>

                  <Link href={`/tournaments/${reg.tournament?.slug}`}>
                    <Button size="sm" variant="ghost" className="text-xs text-cyan-400 font-bold hover:bg-cyan-950/30">
                      View <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
