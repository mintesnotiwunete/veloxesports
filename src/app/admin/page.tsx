import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Users, Star, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { MatchVerificationList } from './MatchVerificationList';
import { AdminAnnouncementForm } from './AdminAnnouncementForm';
import { DisputeResolutionList } from './DisputeResolutionList';
import { PrizePayoutList } from './PrizePayoutList';
import { getDisputedMatches, getPendingMatches, getPayouts } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Execute sequentially to avoid exhausting the serverless connection pool
  const userCount = await prisma.user.count();
  const tournamentCount = await prisma.tournament.count();
  const gameCount = await prisma.game.count();
  const payments = await prisma.payment.aggregate({
    _sum: { amountStars: true },
    where: { status: 'SUCCESS' }
  });
  const pendingMatches = await getPendingMatches();
  const disputedMatches = await getDisputedMatches();
  const payouts = await getPayouts();

  const stats = [
    { name: 'Total Players', value: userCount, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-500/20' },
    { name: 'Active Tournaments', value: tournamentCount, icon: Trophy, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-500/20' },
    { name: 'Supported Games', value: gameCount, icon: Gamepad2, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-500/20' },
    { name: 'Stars Collected', value: payments._sum.amountStars || 0, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-950/40 border-yellow-500/20' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-display font-black uppercase tracking-wider text-white">Dashboard Overview</h1>
           <p className="text-sm text-gray-400 font-medium mt-1">Welcome back, Commander.</p>
        </div>
        <Link href="/admin/tournaments/new" className="bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-cyan-900/60 transition-all box-glow">
          + Launch Tournament
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name} className="bg-[#0d1412] border-white/5">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{stat.name}</p>
                  <h3 className="text-4xl font-display font-black text-white">{stat.value}</h3>
                </div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center border ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="space-y-6">
          <div className="flex items-center space-x-4 opacity-80">
            <div className="flex space-x-1">
               <div className="w-3 h-1 bg-yellow-500 skew-x-12" />
               <div className="w-2 h-1 bg-yellow-500 skew-x-12" />
               <div className="w-1 h-1 bg-yellow-500 skew-x-12" />
            </div>
            <span className="text-yellow-500 font-display uppercase tracking-widest text-sm font-bold">Pending Verifications</span>
          </div>
          <MatchVerificationList initialMatches={pendingMatches} />
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 opacity-80">
            <div className="flex space-x-1">
               <div className="w-3 h-1 bg-cyan-500 skew-x-12" />
               <div className="w-2 h-1 bg-cyan-500 skew-x-12" />
               <div className="w-1 h-1 bg-cyan-500 skew-x-12" />
            </div>
            <span className="text-cyan-500 font-display uppercase tracking-widest text-sm font-bold">Comms Link</span>
          </div>
          <AdminAnnouncementForm />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-4 opacity-80">
            <div className="flex space-x-1">
               <div className="w-3 h-1 bg-red-500 skew-x-12" />
               <div className="w-2 h-1 bg-red-500 skew-x-12" />
               <div className="w-1 h-1 bg-red-500 skew-x-12" />
            </div>
            <span className="text-red-500 font-display uppercase tracking-widest text-sm font-bold">Active Disputes</span>
          </div>
          <DisputeResolutionList initialMatches={disputedMatches} />
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 opacity-80">
            <div className="flex space-x-1">
               <div className="w-3 h-1 bg-emerald-500 skew-x-12" />
               <div className="w-2 h-1 bg-emerald-500 skew-x-12" />
               <div className="w-1 h-1 bg-emerald-500 skew-x-12" />
            </div>
            <span className="text-emerald-500 font-display uppercase tracking-widest text-sm font-bold">Prize Payouts</span>
          </div>
          <PrizePayoutList initialPayouts={payouts} />
        </div>
      </div>
    </div>
  );
}
