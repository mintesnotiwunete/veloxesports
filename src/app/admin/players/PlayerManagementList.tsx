'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShieldAlert, ShieldCheck, Trash2, Search } from 'lucide-react';
import { togglePlayerBan, deletePlayerAccount } from '@/app/actions';
import { triggerHaptic } from '@/lib/haptics';
import { Input } from '@/components/ui/input';

export function PlayerManagementList({ initialPlayers }: { initialPlayers: any[] }) {
  const [players, setPlayers] = useState(initialPlayers);
  const [search, setSearch] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const handleBanToggle = async (userId: string, currentBan: boolean) => {
    setProcessing(userId);
    const res = await togglePlayerBan(userId, !currentBan);
    if (res) {
      triggerHaptic('success');
      setPlayers(players.map(p => p.id === userId ? { ...p, isBanned: !currentBan } : p));
    } else {
      triggerHaptic('error');
    }
    setProcessing(null);
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this player? This action is irreversible.')) return;
    
    setProcessing(userId);
    const success = await deletePlayerAccount(userId);
    if (success) {
      triggerHaptic('success');
      setPlayers(players.filter(p => p.id !== userId));
    } else {
      triggerHaptic('error');
      alert('Failed to delete player. They may have existing matches/tournaments preventing deletion.');
    }
    setProcessing(null);
  };

  const filteredPlayers = players.filter(p => 
    (p.firstName?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (p.telegramUsername?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name or @username..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-[#0d1412] border-white/10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlayers.map(player => (
          <Card key={player.id} className={`border transition-all ${player.isBanned ? 'bg-red-950/20 border-red-500/30' : 'bg-[#0d1412] border-white/5 box-glow'}`}>
            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <Avatar className={`w-12 h-12 border-2 ${player.isBanned ? 'border-red-500' : 'border-cyan-400'}`}>
                  <AvatarImage src={player.avatarUrl} />
                  <AvatarFallback className="bg-black text-white">{player.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className={`font-bold text-sm ${player.isBanned ? 'text-red-400 line-through' : 'text-white'}`}>
                    {player.firstName} {player.lastName}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {player.telegramUsername ? `@${player.telegramUsername}` : `ID: ${player.id.substring(0, 8)}`}
                  </p>
                  <p className="text-[10px] text-cyan-500 font-bold uppercase mt-1">
                    {player._count?.registrations || 0} Events • {player._count?.matchesWon || 0} Wins
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                <Button 
                  size="sm" 
                  onClick={() => handleBanToggle(player.id, player.isBanned)}
                  disabled={processing === player.id}
                  className={`w-full text-xs font-bold uppercase ${player.isBanned ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
                >
                  {player.isBanned ? <><ShieldCheck className="w-3 h-3 mr-1" /> Unban</> : <><ShieldAlert className="w-3 h-3 mr-1" /> Ban</>}
                </Button>
                
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDelete(player.id)}
                  disabled={processing === player.id}
                  className="w-full text-xs font-bold uppercase text-red-500 border-red-500/30 hover:bg-red-950/40"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredPlayers.length === 0 && (
          <div className="col-span-full text-center p-8 text-muted-foreground">
            No players found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
