'use client';

import { useTelegram } from '@/components/TelegramProvider';
import { Bell, Trophy, Users, Star, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Home() {
  const { user } = useTelegram();

  return (
    <div className="flex flex-col min-h-screen p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user?.photo_url} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {user?.first_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-sm font-semibold">{user ? user.first_name : 'Guest'}</h2>
            <p className="text-xs text-muted-foreground">{user?.username ? `@${user.username}` : 'Welcome back'}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-5 h-5" />
        </Button>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/80 to-destructive/80 p-6 text-primary-foreground">
        <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
        <div className="relative z-10 space-y-4">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase drop-shadow-md">
            Compete. Win. Dominate.
          </h1>
          <div className="space-y-1">
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm">Featured Tournament</Badge>
            <h3 className="text-xl font-bold">Winter Clash 2026</h3>
            <p className="text-sm font-medium text-white/80">🎯 Fortnite</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span>$5,000</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>128 / 256</span>
            </div>
          </div>
          
          <Button className="w-full bg-white text-black hover:bg-white/90 font-bold mt-2">
            REGISTER NOW - 50 <Star className="w-4 h-4 ml-1 fill-yellow-500 text-yellow-500" />
          </Button>
        </div>
      </section>

      {/* Upcoming Tournaments */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Upcoming Tournaments</h2>
          <Link href="/tournaments" className="text-sm text-primary font-medium hover:underline">
            View All
          </Link>
        </div>

        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                <div>
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">⚽ EA Sports FC 26</span>
                  </div>
                  <CardTitle className="text-base font-bold">Spring Cup {i}</CardTitle>
                </div>
                <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">Registration Open</Badge>
              </CardHeader>
              <CardContent className="p-4 pt-2 pb-0">
                <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>Aug 30, 2026</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4" />
                    <span>18:00 UTC</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-foreground font-medium">$1,000</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4" />
                    <span>32 / 64</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4">
                <Link href={`/tournaments/spring-cup-${i}`} className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2">
                  View Tournament
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
