import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Star, Gamepad2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [userCount, tournamentCount, gameCount, payments] = await Promise.all([
    prisma.user.count(),
    prisma.tournament.count(),
    prisma.game.count(),
    prisma.payment.aggregate({
      _sum: { amountStars: true },
      where: { status: 'SUCCESS' }
    })
  ]);

  const stats = [
    { name: 'Total Players', value: userCount, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Active Tournaments', value: tournamentCount, icon: Trophy, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Supported Games', value: gameCount, icon: Gamepad2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'Stars Collected', value: payments._sum.amountStars || 0, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold uppercase tracking-wider">Overview</h1>
        <Link href="/admin/tournaments/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-bold uppercase tracking-widest text-sm box-glow hover:bg-primary/80 transition-colors">
          + Create Tournament
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="bg-glass border-white/5">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">{stat.name}</p>
                  <h3 className="text-4xl font-display font-black">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="mt-8">
        <h2 className="text-2xl font-display font-bold uppercase tracking-wider mb-4">Recent Registrations</h2>
        <Card className="bg-glass border-white/5">
          <CardContent className="p-8 text-center text-muted-foreground">
            No recent activity to display.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
