'use client';

import { useEffect, useState } from 'react';
import { useTelegram } from '@/components/TelegramProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Gamepad2, Calendar, ChevronRight, Zap, Swords, AlertTriangle, Megaphone, Users, Search as SearchIcon, Bell } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LandingPage } from '@/components/LandingPage';
import { getActiveTournaments, getUserMatches, getUserTeam, createTeam, getAnnouncements, getUnreadNotificationCount } from '@/app/actions';
import { triggerHaptic } from '@/lib/haptics';
import { Input } from '@/components/ui/input';

export default function Home() {
  const { user, initData } = useTelegram();
  const [mounted, setMounted] = useState(false);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [myMatches, setMyMatches] = useState<any[]>([]);
  const [team, setTeam] = useState<any>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    setMounted(true);
    getActiveTournaments().then(setTournaments).catch(console.error);
    getAnnouncements().then(setAnnouncements).catch(console.error);
    if (user?.id) {
      getUserMatches(user.id).then(setMyMatches).catch(console.error);
      getUserTeam(user.id).then(setTeam).catch(console.error);
      getUnreadNotificationCount(user.id).then(setUnreadCount).catch(console.error);
    }
  }, [user]);

  const handleCreateTeam = async () => {
    if (!newTeamName || !user?.id) return;
    triggerHaptic('medium');
    const t = await createTeam(user.id, newTeamName, 'A new squad on Velox.');
    if (t) {
      triggerHaptic('success');
      getUserTeam(user.id).then(setTeam).catch(console.error);
      setIsCreatingTeam(false);
    }
  };

  if (!mounted) return null;

  if (!initData && process.env.NODE_ENV === 'production') {
    return <LandingPage />;
  }
  
  if (!initData) {
     return <LandingPage />;
  }

  // Find the featured tournament (first one, usually Winter Clash or whatever is newest)
  const featured = tournaments.length > 0 ? tournaments[0] : null;

  const pendingActionMatches = myMatches.filter(m => m.status === 'SCHEDULED' || m.status === 'LIVE');

  return (
    <div className="flex flex-col space-y-6 p-4 pt-8 pb-24 max-w-md mx-auto">
      
      {/* Header Profile Section */}
      <div className="flex items-center justify-between bg-glass rounded-2xl p-4 border border-white/5 box-glow">
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
        
        <div className="flex items-center space-x-2">
          <Link href="/search" onClick={() => triggerHaptic('light')}>
            <div className="w-10 h-10 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-900/60 transition-all">
              <SearchIcon className="w-5 h-5" />
            </div>
          </Link>
          <Link href="/notifications" onClick={() => triggerHaptic('light')}>
            <div className="relative w-10 h-10 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-900/60 transition-all">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-background rounded-full" />
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Action Required Alert */}
      {pendingActionMatches.length > 0 && (
        <Link href="/matches" onClick={() => triggerHaptic('light')}>
          <Card className="bg-red-500/10 border-red-500/30 box-glow overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse" />
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-red-500 font-bold uppercase text-sm flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Action Required
                </h3>
                <p className="text-xs text-muted-foreground mt-1">You have {pendingActionMatches.length} pending match(es) to play or submit scores for.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-red-500 opacity-50" />
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Announcements Scroller */}
      {announcements.length > 0 && (
        <Card className="bg-glass border-white/5 overflow-hidden">
          <div className="bg-primary/20 p-2 flex items-center space-x-2 border-b border-white/5">
            <Megaphone className="w-3 h-3 text-primary ml-2" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Announcements</span>
          </div>
          <CardContent className="p-0">
            <div className="flex overflow-x-auto snap-x space-x-4 p-4 scrollbar-hide">
              {announcements.map((ann, idx) => (
                <div key={ann.id} className="snap-start shrink-0 w-64 p-3 bg-black/30 rounded-xl border border-white/5">
                  <h4 className="text-xs font-bold text-white mb-1 uppercase">{ann.title}</h4>
                  <p className="text-[10px] text-muted-foreground leading-tight">{ann.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Squad / Teams Shortcut */}
      <Card className="bg-glass border-white/5 box-glow overflow-hidden">
        <div className="bg-secondary/50 p-2 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center space-x-2">
            <Users className="w-3 h-3 text-cyan-500 ml-2" />
            <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Squads & Clans</span>
          </div>
          <Link href="/teams" className="text-[10px] font-bold text-slate-400 hover:text-white uppercase px-2">Browse All</Link>
        </div>
        <CardContent className="p-4">
          {team ? (
            <Link href={`/teams/${team.slug}`}>
              <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-sm transition-colors">
                <div className="flex flex-col">
                  <span className="text-sm font-black uppercase text-white group-hover:text-cyan-400">{team.name}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{team.members.length} Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 uppercase text-[10px] bg-cyan-500/10">Active</Badge>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">You are not in a squad.</p>
              <Link href="/teams/new">
                <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold uppercase border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20">
                  Form Squad
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

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
