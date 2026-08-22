'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { Trophy, Search, Users, ChevronRight, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { getAllTournaments, getAllGames } from '@/app/actions';
import { triggerHaptic } from '@/lib/haptics';

export default function TournamentsPage() {
  const [games, setGames] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [gamesData, tourneysData] = await Promise.all([
          getAllGames(),
          getAllTournaments()
        ]);
        setGames(gamesData);
        setTournaments(tourneysData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleFilter = (gameSlug: string, query: string) => {
    triggerHaptic('selection');
    setSelectedGame(gameSlug);
    startTransition(async () => {
      const filtered = await getAllTournaments({
        gameSlug: gameSlug === 'all' ? undefined : gameSlug,
        query: query.trim() === '' ? undefined : query
      });
      setTournaments(filtered);
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    startTransition(async () => {
      const filtered = await getAllTournaments({
        gameSlug: selectedGame === 'all' ? undefined : selectedGame,
        query: val.trim() === '' ? undefined : val
      });
      setTournaments(filtered);
    });
  };

  return (
    <div className="flex flex-col min-h-screen p-4 pb-24 space-y-4 max-w-lg mx-auto">
      {/* Header */}
      <header className="flex justify-between items-center pt-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">Live Arenas</span>
          </div>
          <h1 className="text-2xl font-display font-black uppercase tracking-wider text-foreground">Tournaments</h1>
        </div>
        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 font-mono text-xs px-3 py-1 bg-cyan-950/20">
          {tournaments.length} Events
        </Badge>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input 
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search tournaments, games..." 
          className="pl-10 h-11 bg-card/80 border-white/10 rounded-xl focus-visible:ring-cyan-400 placeholder:text-muted-foreground/60 text-sm font-medium" 
        />
        {searchQuery && (
          <button 
            onClick={() => { setSearchQuery(''); handleFilter(selectedGame, ''); }}
            className="absolute right-3 top-3 text-xs text-muted-foreground hover:text-foreground p-1 font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Game Filter Pills */}
      <ScrollArea className="w-full whitespace-nowrap pb-1">
        <div className="flex space-x-2">
          <button
            onClick={() => handleFilter('all', searchQuery)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              selectedGame === 'all'
                ? 'bg-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-105'
                : 'bg-card border border-white/10 text-muted-foreground hover:text-foreground hover:border-cyan-500/30'
            }`}
          >
            🔥 All Titles
          </button>
          
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => handleFilter(game.slug, searchQuery)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                selectedGame === game.slug
                  ? 'bg-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-105'
                  : 'bg-card border border-white/10 text-muted-foreground hover:text-foreground hover:border-cyan-500/30'
              }`}
            >
              {game.name}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>

      {/* Tournaments List */}
      <div className="space-y-3 pt-1">
        {loading || isPending ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">Scanning tournament grid...</p>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-card/40 rounded-2xl border border-white/5 p-6">
            <div className="h-12 w-12 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-cyan-400" />
            </div>
            <h3 className="font-display font-bold text-lg uppercase">No Tournaments Found</h3>
            <p className="text-muted-foreground text-xs max-w-[240px]">
              No events matched &quot;{searchQuery || selectedGame}&quot;. Try switching categories or clearing search.
            </p>
            <Button 
              onClick={() => { setSelectedGame('all'); setSearchQuery(''); handleFilter('all', ''); }}
              variant="outline" 
              size="sm" 
              className="text-xs uppercase font-bold tracking-wider border-cyan-500/30 text-cyan-400"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          tournaments.map((t) => {
            const registered = t._count?.registrations ?? t.currentPlayers ?? 0;
            const max = t.maxPlayers || 64;
            const fillPct = Math.min(Math.round((registered / max) * 100), 100);

            return (
              <Link 
                key={t.id} 
                href={`/tournaments/${t.slug}`}
                onClick={() => triggerHaptic('light')}
                className="block group"
              >
                <Card className="bg-card/80 border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] overflow-hidden rounded-2xl">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-cyan-950/50 text-cyan-400 border border-cyan-500/30">
                        {t.game?.name || 'Esports'}
                      </span>
                      <div className="flex items-center space-x-1.5 bg-yellow-950/40 border border-yellow-500/30 px-2.5 py-0.5 rounded-full">
                        <Trophy className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs font-black text-yellow-400 tracking-wide">{t.prizePool || '$1,000'}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-black uppercase tracking-wide group-hover:text-cyan-400 transition-colors">
                        {t.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {t.description || 'Single Elimination Tournament with instant Telegram Stars payout.'}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-cyan-400" /> {registered} / {max} Players
                        </span>
                        <span className="font-mono text-cyan-400 font-bold">{fillPct}% Full</span>
                      </div>
                      <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-white/5">
                      <div className="flex items-center space-x-1 text-xs">
                        <span className="text-muted-foreground font-semibold">Entry:</span>
                        <span className="font-extrabold text-cyan-400 flex items-center gap-0.5">
                          ⭐ {t.entryFeeStars} <span className="text-[10px] text-muted-foreground">Stars</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center text-xs font-bold uppercase tracking-wider text-cyan-400 group-hover:translate-x-1 transition-transform">
                        Join Arena <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
