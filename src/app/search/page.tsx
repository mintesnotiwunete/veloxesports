'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search as SearchIcon, Users, Trophy, ChevronRight, Gamepad2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { globalSearch } from '@/app/actions';
import { triggerHaptic } from '@/lib/haptics';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ tournaments: any[]; players: any[]; teams: any[] }>({
    tournaments: [], players: [], teams: []
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 2) return;
    
    setLoading(true);
    triggerHaptic('light');
    const res = await globalSearch(query);
    setResults(res);
    setLoading(false);
  };

  return (
    <div className="p-4 pt-8 pb-24 max-w-md mx-auto min-h-screen space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => router.back()} className="p-2 bg-glass rounded-full text-cyan-400">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-display font-black uppercase italic tracking-wider">Global Search</h1>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
        <Input 
          autoFocus
          placeholder="Search players, teams, or tournaments..." 
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-12 h-12 bg-black/50 border-white/10 rounded-2xl text-sm"
        />
        <button type="submit" className="hidden" />
      </form>

      {loading && <div className="text-center p-8 text-cyan-400 animate-pulse uppercase font-bold text-xs">Searching Database...</div>}

      {!loading && (results.tournaments.length > 0 || results.players.length > 0 || results.teams.length > 0) && (
        <div className="space-y-8">
          
          {/* Players */}
          {results.players.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase flex items-center">
                <Users className="w-4 h-4 mr-2" /> Players
              </h3>
              <div className="grid gap-2">
                {results.players.map(p => (
                  <Card key={p.id} className="bg-glass border-white/5 p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10 border border-cyan-500/30">
                        <AvatarImage src={p.avatarUrl} />
                        <AvatarFallback className="bg-cyan-950 text-cyan-400 font-bold">{p.firstName?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm text-white">{p.firstName}</p>
                        <p className="text-[10px] text-cyan-400">@{p.telegramUsername}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Teams */}
          {results.teams.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase flex items-center">
                <Users className="w-4 h-4 mr-2" /> Squads
              </h3>
              <div className="grid gap-2">
                {results.teams.map(t => (
                  <Card key={t.id} className="bg-glass border-white/5 p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-white uppercase">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t._count?.members || 1} Members</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Tournaments */}
          {results.tournaments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase flex items-center">
                <Trophy className="w-4 h-4 mr-2" /> Tournaments
              </h3>
              <div className="grid gap-2">
                {results.tournaments.map(t => (
                  <Link key={t.id} href={`/tournaments/${t.slug}`} onClick={() => triggerHaptic('light')}>
                    <Card className="bg-glass border-white/5 p-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-cyan-950 border border-cyan-500/30 rounded-lg flex items-center justify-center">
                          <Gamepad2 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white uppercase">{t.name}</p>
                          <Badge variant="outline" className="text-[9px] border-cyan-500/30 text-cyan-400 mt-1">{t.game?.name}</Badge>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {!loading && query.length >= 2 && results.tournaments.length === 0 && results.players.length === 0 && results.teams.length === 0 && (
        <div className="text-center p-8 text-muted-foreground">
          <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
