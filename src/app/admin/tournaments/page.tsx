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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold uppercase tracking-wider">Tournaments</h1>
        <Link href="/admin/tournaments/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-bold uppercase tracking-widest text-sm box-glow hover:bg-primary/80 transition-colors">
          + Create Tournament
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {tournaments.map((t) => (
          <Card key={t.id} className="bg-glass border-white/5 hover:border-primary/50 transition-colors">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-display font-bold uppercase">{t.name}</h3>
                  <Badge variant="secondary" className="text-[10px]">{t.game.name}</Badge>
                  <Badge className="bg-green-500/20 text-green-500 border-0 text-[10px]">{t.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Prize: {t.prizePool} | Entry: {t.entryFeeStars} Stars | Players: {t._count.registrations}/{t.maxPlayers}</p>
              </div>
              <Link href={`/admin/tournaments/${t.id}`} className="text-primary font-bold text-sm hover:underline">
                Manage
              </Link>
            </CardContent>
          </Card>
        ))}
        {tournaments.length === 0 && (
          <div className="text-center p-8 text-muted-foreground bg-glass rounded-xl">No tournaments created yet.</div>
        )}
      </div>
    </div>
  );
}
