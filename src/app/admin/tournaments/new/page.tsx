import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { NewTournamentForm } from './NewTournamentForm';

export const dynamic = 'force-dynamic';

export default async function NewTournament() {
  const games = await prisma.game.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-display font-black uppercase tracking-wider text-white">New Tournament</h1>
           <p className="text-sm text-gray-400 font-medium mt-1">Deploy a new competition to the grid.</p>
        </div>
        <Link href="/admin/tournaments" className="text-gray-500 hover:text-white text-sm font-bold uppercase">Cancel</Link>
      </div>
      
      <Card className="bg-[#0d1412] border-white/5">
        <CardContent className="p-6">
          <NewTournamentForm games={games} />
        </CardContent>
      </Card>
    </div>
  );
}
