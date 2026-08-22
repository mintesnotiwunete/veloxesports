import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminTournaments() {
  const tournaments = await prisma.tournament.findMany({
    include: { game: true, _count: { select: { registrations: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-display font-black uppercase tracking-wider text-white">Tournaments</h1>
           <p className="text-sm text-gray-400 font-medium mt-1">Manage your live and upcoming events.</p>
        </div>
        <Link href="/admin/tournaments/new" className="bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-cyan-900/60 transition-all box-glow">
          + Launch Tournament
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {tournaments.map((t) => (
          <Card key={t.id} className="bg-[#0d1412] border-white/5 hover:border-cyan-500/30 transition-colors">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-display font-bold uppercase text-white">{t.name}</h3>
                  <Badge variant="secondary" className="text-[10px] bg-cyan-950/40 text-cyan-400">{t.game.name}</Badge>
                  <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px]">{t.status}</Badge>
                </div>
                <p className="text-sm text-gray-400">Prize: {t.prizePool} | Entry: {t.entryFeeStars} Stars | Players: {t._count.registrations}/{t.maxPlayers}</p>
              </div>
              <Link href={`/admin/tournaments/${t.id}`} className="text-cyan-400 font-bold text-sm hover:underline">
                Manage
              </Link>
            </CardContent>
          </Card>
        ))}
        {tournaments.length === 0 && (
          <div className="text-center p-8 text-gray-500 bg-[#0d1412] rounded-xl border border-white/5">No tournaments created yet.</div>
        )}
      </div>
    </div>
  );
}
