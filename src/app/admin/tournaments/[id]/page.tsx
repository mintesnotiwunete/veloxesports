import { prisma } from '@/lib/prisma';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { TournamentManager } from './TournamentManager';

export default async function ManageTournament({ params }: { params: { id: string } }) {
  const tournament = await prisma.tournament.findUnique({
    where: { id: params.id },
    include: { game: true }
  });

  if (!tournament) return <div className="text-white">Tournament not found.</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4 mb-4">
         <Link href="/admin/tournaments" className="text-gray-500 hover:text-white text-sm font-bold uppercase">&larr; Back</Link>
      </div>
      <div>
         <h1 className="text-3xl font-display font-black uppercase tracking-wider text-white">Manage: {tournament.name}</h1>
         <p className="text-sm text-gray-400 font-medium mt-1">ID: {tournament.id}</p>
      </div>

      <TournamentManager tournament={tournament} />
    </div>
  );
}
