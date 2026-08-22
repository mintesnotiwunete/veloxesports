'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, Crown, Zap, RefreshCw, UserCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getLeaderboardStandings } from '@/app/actions';
import { useTelegram } from '@/components/TelegramProvider';
import { triggerHaptic } from '@/lib/haptics';

export default function StandingsPage() {
  const { user: currentUser } = useTelegram();
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all' | 'season' | 'weekly'>('season');

  useEffect(() => {
    async function loadStandings() {
      setLoading(false);
      try {
        const data = await getLeaderboardStandings();
        setStandings(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStandings();
  }, []);

  const top1 = standings[0];
  const top2 = standings[1];
  const top3 = standings[2];
  const restStandings = standings.slice(3);

  const getTier = (rank: number) => {
    if (rank === 1) return { name: 'CHALLENGER', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' };
    if (rank <= 3) return { name: 'GRANDMASTER', color: 'text-red-400 border-red-500/40 bg-red-950/30' };
    if (rank <= 10) return { name: 'MASTER', color: 'text-purple-400 border-purple-500/40 bg-purple-950/30' };
    return { name: 'DIAMOND', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30' };
  };

  return (
    <div className="flex flex-col min-h-screen p-4 pb-28 space-y-5 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center pt-2">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Global Leaderboard</span>
          </div>
          <h1 className="text-2xl font-display font-black uppercase tracking-wider text-foreground">Hall of Fame</h1>
        </div>
        <Badge className="bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 font-mono text-xs px-3 py-1">
          Season 1
        </Badge>
      </header>

      {/* Timeframe Filter Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-card/60 rounded-xl border border-white/5">
        {(['season', 'weekly', 'all'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { triggerHaptic('selection'); setTimeframe(t); }}
            className={`py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              timeframe === t 
                ? 'bg-cyan-500 text-black font-extrabold shadow-md' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'season' ? '🏆 Season 1' : t === 'weekly' ? '⚡ Weekly' : '🌐 All-Time'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">Calculating global points...</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {standings.length >= 3 && (
            <div className="grid grid-cols-3 gap-2 items-end pt-4 pb-2">
              {/* Rank 2 (Silver) */}
              {top2 && (
                <div className="flex flex-col items-center text-center space-y-2 order-1">
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.4)]">
                      <AvatarImage src={top2.user?.avatarUrl} />
                      <AvatarFallback className="bg-slate-800 text-slate-200 font-bold text-base">
                        {top2.user?.firstName?.charAt(0) || '2'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-1 bg-slate-300 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-background">
                      2
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold truncate max-w-[90px] text-foreground">{top2.user?.firstName}</p>
                    <p className="text-[11px] font-black text-slate-300">{top2.points} PTS</p>
                  </div>
                  <div className="w-full bg-gradient-to-t from-slate-800/80 to-slate-700/40 rounded-t-xl h-20 flex items-center justify-center border-t border-slate-400/30">
                    <Medal className="w-6 h-6 text-slate-300" />
                  </div>
                </div>
              )}

              {/* Rank 1 (Gold - Elevated) */}
              {top1 && (
                <div className="flex flex-col items-center text-center space-y-2 order-2 -mt-4">
                  <div className="relative">
                    <Crown className="w-6 h-6 text-amber-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
                    <Avatar className="w-18 h-18 border-2 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)] ring-2 ring-amber-400/30">
                      <AvatarImage src={top1.user?.avatarUrl} />
                      <AvatarFallback className="bg-amber-950 text-amber-300 font-black text-xl">
                        {top1.user?.firstName?.charAt(0) || '1'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-1 bg-amber-400 text-amber-950 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-background shadow">
                      1
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-black truncate max-w-[105px] text-amber-300">{top1.user?.firstName}</p>
                    <p className="text-xs font-black text-amber-400">{top1.points} PTS</p>
                  </div>
                  <div className="w-full bg-gradient-to-t from-amber-950/80 to-amber-600/30 rounded-t-xl h-28 flex items-center justify-center border-t border-amber-400/50">
                    <Trophy className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
              )}

              {/* Rank 3 (Bronze) */}
              {top3 && (
                <div className="flex flex-col items-center text-center space-y-2 order-3">
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-amber-700/60 shadow-[0_0_15px_rgba(180,83,9,0.3)]">
                      <AvatarImage src={top3.user?.avatarUrl} />
                      <AvatarFallback className="bg-amber-950 text-amber-600 font-bold text-base">
                        {top3.user?.firstName?.charAt(0) || '3'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-1 bg-amber-700 text-amber-100 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-background">
                      3
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold truncate max-w-[90px] text-foreground">{top3.user?.firstName}</p>
                    <p className="text-[11px] font-black text-amber-600">{top3.points} PTS</p>
                  </div>
                  <div className="w-full bg-gradient-to-t from-amber-950/60 to-amber-900/30 rounded-t-xl h-16 flex items-center justify-center border-t border-amber-700/30">
                    <Medal className="w-5 h-5 text-amber-700" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ranks 4+ List */}
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3">
              <span>Player & Tier</span>
              <span>Record & Score</span>
            </div>

            {restStandings.map((s, idx) => {
              const rank = idx + 4;
              const tier = getTier(rank);
              const winRate = s.matchesPlayed > 0 ? Math.round((s.wins / s.matchesPlayed) * 100) : 0;

              return (
                <Card 
                  key={s.id || idx}
                  className="bg-card/70 border-white/5 hover:border-cyan-500/30 transition-all rounded-xl"
                >
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-black text-muted-foreground w-6 text-center">
                        #{rank}
                      </span>
                      <Avatar className="w-9 h-9 border border-white/10">
                        <AvatarImage src={s.user?.avatarUrl} />
                        <AvatarFallback className="text-xs font-bold">
                          {s.user?.firstName?.charAt(0) || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-bold text-foreground truncate max-w-[130px]">
                            {s.user?.firstName} {s.user?.lastName || ''}
                          </p>
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${tier.color}`}>
                            {tier.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {s.user?.telegramUsername ? `@${s.user.telegramUsername}` : 'Velox Warrior'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-cyan-400 font-mono">{s.points} PTS</p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {s.wins}W / {s.losses || 0}L ({winRate}%)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Sticky "My Position" bottom card */}
      <div className="fixed bottom-16 left-0 right-0 max-w-lg mx-auto px-4 z-40">
        <div className="bg-[#0b1311]/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-3 shadow-[0_0_20px_rgba(6,182,212,0.25)] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-cyan-500 text-black font-black text-xs px-2.5 py-1 rounded-lg">
              YOU
            </div>
            <div>
              <p className="text-xs font-bold text-foreground flex items-center gap-1">
                {currentUser?.first_name || 'Guest Warrior'} <UserCheck className="w-3 h-3 text-cyan-400" />
              </p>
              <p className="text-[10px] text-cyan-400 font-medium">Unranked • Play matches to climb</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-black text-cyan-400">0 PTS</span>
            <p className="text-[9px] text-muted-foreground uppercase font-bold">Tier: Bronze</p>
          </div>
        </div>
      </div>
    </div>
  );
}
