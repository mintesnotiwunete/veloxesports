'use client';

import { useEffect, useState } from 'react';
import { useTelegram } from '@/components/TelegramProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Gamepad2, Calendar, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LandingPage } from '@/components/LandingPage';
import { getActiveTournaments } from '@/app/actions';

export default function Home() {
  const { user, initData } = useTelegram();
  const [mounted, setMounted] = useState(false);
  const [tournaments, setTournaments] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    getActiveTournaments().then(setTournaments).catch(console.error);
  }, []);

  if (!mounted) return null;

  if (!initData && process.env.NODE_ENV === 'production') {
    return <LandingPage />;
  }
  
  if (!initData) {
     return <LandingPage />;
  }

  // Find the featured tournament (first one, usually Winter Clash or whatever is newest)
  const featured = tournaments.length > 0 ? tournaments[0] : null;

  return (
    <div className="flex flex-col space-y-8 p-4 pt-8 pb-24 max-w-md mx-auto">
      
      {/* Header Profile Section */}
      <div className="flex items-center justify-between bg-glass rounded-2xl p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 border-2 border-primary box-glow">
            <AvatarImage src={user?.photo_url} />
            <AvatarFallback className="bg-secondary text-secondary-foreground font-display font-bold">
              {user?.first_name?.charAt(0) || 'V'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-display font-bold uppercase tracking-wide">{user ? user.first_name : 'Guest Player'}</h2>
            <p className="text-xs text-primary font-medium flex items-center">
              <Zap className="w-3 h-3 mr-1" /> {user?.username ? '@'+user.username : 'Ready to dominate'}
            </p>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      {featured && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-secondary border border-primary/30 p-6 box-glow">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Gamepad2 className="w-32 h-32" />
          </div>
          <Badge variant="outline" className="border-primary text-primary bg-primary/10 mb-4">LIVE NOW</Badge>
          <h1 className="text-4xl font-display font-black uppercase italic leading-none mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">{featured.name.split(' ')[0]}</span>
            <br />{featured.name.split(' ').slice(1).join(' ')}
          </h1>
          <p className="text-sm text-muted-foreground mb-6 max-w-[200px]">Compete for the {featured.prizePool} prize pool in {featured.game.name}.</p>
          <Link href={`/tournaments/${featured.slug}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold transition-all bg-primary text-primary-foreground hover:bg-primary/80 h-10 px-6 box-glow uppercase tracking-wider">
            Join Tournament <ChevronRight className="ml-1 w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Upcoming Tournaments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-display font-bold uppercase tracking-wider flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-primary" /> Upcoming Matches
          </h3>
          <Link href="/tournaments" className="text-xs font-bold text-primary hover:underline uppercase">View All</Link>
        </div>
        
        <div className="grid gap-4">
          {tournaments.slice(1).map((t) => (
            <Link key={t.id} href={`/tournaments/${t.slug}`}>
              <Card className="bg-glass border-white/5 hover:border-primary/50 transition-all hover:box-glow overflow-hidden group">
                <div className="flex h-24">
                  <div className="w-1/3 bg-secondary flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Gamepad2 className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="w-2/3 p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-display font-bold uppercase truncate max-w-[120px]">{t.name}</h4>
                        <Badge variant="secondary" className="text-[10px] px-1 py-0">{t.game.name}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" /> 
                        {new Date(t.startTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-sm">{t.prizePool} Prize</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {tournaments.length === 0 && (
             <div className="text-center p-8 text-muted-foreground bg-glass rounded-xl">No active tournaments. Create one in the admin dashboard!</div>
          )}
        </div>
      </div>
    </div>
  );
}
