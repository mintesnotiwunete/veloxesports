'use client';

import { useEffect, useState } from 'react';
import { useTelegram } from '@/components/TelegramProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, ChevronLeft, Check, Trophy, Swords, Zap, Info, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserNotifications, markNotificationsRead } from '@/app/actions';
import { triggerHaptic } from '@/lib/haptics';

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useTelegram();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (user?.id) {
      getUserNotifications(user.id).then(notifs => {
        setNotifications(notifs);
        setLoading(false);
        // Mark as read after fetching
        markNotificationsRead(user.id);
      }).catch(console.error);
    }
  }, [user]);

  if (!mounted) return null;

  const getIconForType = (type: string) => {
    switch (type) {
      case 'MATCH': return <Swords className="w-5 h-5 text-red-400" />;
      case 'REWARD': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'TOURNAMENT': return <Trophy className="w-5 h-5 text-cyan-400" />;
      case 'TEAM_REQUEST': 
      case 'TEAM_ACCEPT': return <Users className="w-5 h-5 text-cyan-400" />;
      default: return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="p-4 pt-8 pb-24 max-w-md mx-auto min-h-screen space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => router.back()} className="p-2 bg-glass rounded-full text-cyan-400">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-display font-black uppercase italic tracking-wider flex items-center">
          <Bell className="w-5 h-5 mr-2 text-primary" /> Notifications
        </h1>
      </div>

      {loading ? (
        <div className="text-center p-8 text-cyan-400 animate-pulse uppercase font-bold text-xs">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-glass rounded-2xl border border-white/5">
          <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold">All Caught Up!</h3>
          <p className="text-sm text-muted-foreground mt-2">You have no new notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const isTeamNotif = notif.type.startsWith('TEAM_');
            const teamSlug = isTeamNotif ? notif.type.split(':')[1] : null;

            return (
              <Card key={notif.id} className={`bg-glass p-4 border ${notif.isRead ? 'border-white/5 opacity-70' : 'border-cyan-500/30 box-glow'}`}>
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-xl border ${notif.isRead ? 'bg-black/30 border-white/5' : 'bg-cyan-950/40 border-cyan-500/30'}`}>
                    {getIconForType(notif.type.split(':')[0])}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-white uppercase">{notif.title}</h4>
                      {!notif.isRead && <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{notif.message}</p>
                    
                    {isTeamNotif && teamSlug && (
                      <div className="mt-3">
                        <Link href={`/teams/${teamSlug}`}>
                          <Button size="sm" className="h-7 text-[10px] font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black">
                            {notif.type.startsWith('TEAM_REQUEST') ? 'Review Request' : 'View Squad'}
                          </Button>
                        </Link>
                      </div>
                    )}

                    <p className="text-[9px] text-muted-foreground/50 mt-2 font-mono">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
