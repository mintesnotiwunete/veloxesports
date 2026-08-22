import { getAllPlayers } from '@/app/actions';
import { PlayerManagementList } from './PlayerManagementList';

export const dynamic = 'force-dynamic';

export default async function PlayersPage() {
  const players = await getAllPlayers();

  return (
    <div className="space-y-8">
      <div>
         <h1 className="text-3xl font-display font-black uppercase tracking-wider text-white">Players</h1>
         <p className="text-sm text-gray-400 font-medium mt-1">Manage registered users and their stats.</p>
      </div>
      
      <PlayerManagementList initialPlayers={players} />
    </div>
  );
}
