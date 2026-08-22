import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Star, Gamepad2 } from 'lucide-react';

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
    { name: 'Total Players', value: userCount, icon: Users },
    { name: 'Tournaments', value: tournamentCount, icon: Trophy },
    { name: 'Games', value: gameCount, icon: Gamepad2 },
    { name: 'Stars Collected', value: payments._sum.amountStars || 0, icon: Star },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
