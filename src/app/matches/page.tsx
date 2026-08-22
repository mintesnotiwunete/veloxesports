'use client';

import { useEffect, useState } from 'react';
import { useTelegram } from '@/components/TelegramProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Swords, Clock, CheckCircle2, AlertTriangle, MessageSquare, Upload } from 'lucide-react';
import Link from 'next/link';
import { getUserMatches } from '@/app/actions';
import { triggerHaptic } from '@/lib/haptics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MatchesPage() {
  const { user } = useTelegram();
  const [mounted, setMounted] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    if (user?.id) {
      getUserMatches(user.id).then(setMatches).catch(console.error);
    }
  }, [user]);

  if (!mounted) return null;

  const upcoming = matches.filter(m => m.status === 'SCHEDULED' || m.status === 'LIVE');
  const past = matches.filter(m => m.status === 'COMPLETED' || m.status === 'SUBMITTED' || m.status === 'DISPUTED');

  const MatchCard = ({ match }: { match: any }) => {
    const isP1Winner = match.winnerId === match.player1?.id;
    const isP2Winner = match.winnerId === match.player2?.id;

    return (
      <Card className="bg-glass border-white/5 p-4 box-glow mb-4">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline" className="border-primary/50 text-primary uppercase text-[10px]">
            {match.tournament.game.name}
          </Badge>
          <div className="flex items-center space-x-2">
            {match.status === 'LIVE' && <Badge className="bg-red-500 animate-pulse">LIVE</Badge>}
            {match.status === 'SCHEDULED' && <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Upcoming</Badge>}
            {match.status === 'SUBMITTED' && <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50"><AlertTriangle className="w-3 h-3 mr-1" />Reviewing</Badge>}
            {match.status === 'DISPUTED' && <Badge className="bg-red-500/20 text-red-500 border-red-500/50"><AlertTriangle className="w-3 h-3 mr-1" />Disputed</Badge>}
            {match.status === 'COMPLETED' && <Badge className="bg-primary/20 text-primary border-primary/50"><CheckCircle2 className="w-3 h-3 mr-1" />Done</Badge>}
          </div>
        </div>

        <div className="text-center mb-4">
          <h3 className="text-sm font-bold text-muted-foreground uppercase">{match.tournament.name}</h3>
          <p className="text-xs text-muted-foreground">Round {match.round}</p>
        </div>

        <div className="flex justify-between items-center">
          {/* Player 1 */}
          <div className="flex flex-col items-center flex-1">
            <Avatar className={`h-12 w-12 border-2 ${isP1Winner ? 'border-primary' : 'border-white/10'}`}>
              <AvatarImage src={match.player1?.avatarUrl} />
              <AvatarFallback>{match.player1?.firstName?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-bold mt-2 truncate w-full text-center">{match.player1?.firstName || 'TBD'}</span>
            {(match.status === 'COMPLETED' || match.status === 'SUBMITTED') && (
              <span className="text-xl font-black mt-1">{match.player1Score}</span>
            )}
          </div>

          <div className="px-4 text-muted-foreground font-black italic text-lg opacity-50">VS</div>

          {/* Player 2 */}
          <div className="flex flex-col items-center flex-1">
            <Avatar className={`h-12 w-12 border-2 ${isP2Winner ? 'border-primary' : 'border-white/10'}`}>
              <AvatarImage src={match.player2?.avatarUrl} />
              <AvatarFallback>{match.player2?.firstName?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-bold mt-2 truncate w-full text-center">{match.player2?.firstName || 'TBD'}</span>
            {(match.status === 'COMPLETED' || match.status === 'SUBMITTED') && (
               <span className="text-xl font-black mt-1">{match.player2Score}</span>
            )}
          </div>
        </div>

        {match.status !== 'COMPLETED' && (
          <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
            <Link href={`/matches/${match.id}`} className="flex-1" onClick={() => triggerHaptic('light')}>
              <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30 uppercase text-xs font-bold">
                <Swords className="w-4 h-4 mr-2" /> Match Room
              </Button>
            </Link>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="p-4 pt-8 pb-24 max-w-md mx-auto min-h-screen">
      <div className="flex items-center space-x-2 mb-6">
        <Swords className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-display font-black uppercase italic tracking-wider">Match Center</h1>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full bg-glass border border-white/5 p-1 rounded-full mb-6">
          <TabsTrigger value="upcoming" className="flex-1 rounded-full uppercase text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            Active ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex-1 rounded-full uppercase text-xs font-bold data-[state=active]:bg-secondary transition-all">
            History ({past.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length === 0 ? (
            <div className="text-center py-12 bg-glass rounded-xl border border-white/5">
              <Swords className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold">No Active Matches</h3>
              <p className="text-sm text-muted-foreground mt-2">Join a tournament to start playing!</p>
              <Link href="/tournaments">
                <Button className="mt-4 bg-primary text-primary-foreground font-bold uppercase" onClick={() => triggerHaptic('medium')}>
                  Find Tournaments
                </Button>
              </Link>
            </div>
          ) : (
            upcoming.map(m => <MatchCard key={m.id} match={m} />)
          )}
        </TabsContent>

        <TabsContent value="past">
           {past.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No past matches found.</div>
          ) : (
            past.map(m => <MatchCard key={m.id} match={m} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
