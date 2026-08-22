'use client';
import { useTelegram } from '@/components/TelegramProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { user } = useTelegram();

  return (
    <div className="flex flex-col min-h-screen p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      </header>

      <div className="flex flex-col items-center p-6 bg-card rounded-2xl border border-border/50 text-center space-y-4">
        <Avatar className="w-24 h-24 border-4 border-background">
          <AvatarImage src={user?.photo_url} />
          <AvatarFallback className="text-3xl bg-primary/20 text-primary">
            {user?.first_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{user ? user.first_name : 'Guest Player'}</h2>
          <p className="text-muted-foreground">{user?.username ? `@` + user.username : 'Link your account'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
          <p className="text-3xl font-black text-primary">0</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Tournaments</p>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border/50 text-center">
          <p className="text-3xl font-black text-yellow-500">0</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Wins</p>
        </div>
      </div>
    </div>
  );
}
