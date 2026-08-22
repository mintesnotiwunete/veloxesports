'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Save, AlertTriangle } from 'lucide-react';
import { updateTournament, deleteTournament } from '@/app/actions';
import { triggerHaptic } from '@/lib/haptics';
import { useRouter } from 'next/navigation';

export function TournamentManager({ tournament }: { tournament: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState(tournament.name);
  const [status, setStatus] = useState(tournament.status);
  const [prizePool, setPrizePool] = useState(tournament.prizePool || '');

  const handleUpdate = async () => {
    setLoading(true);
    const res = await updateTournament(tournament.id, {
      name,
      status,
      prizePool
    });
    if (res) {
      triggerHaptic('success');
      alert('Tournament updated successfully.');
      router.refresh();
    } else {
      triggerHaptic('error');
      alert('Failed to update tournament.');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you absolutely sure you want to delete ${tournament.name}? This will delete all matches, registrations, and payouts associated with it.`)) return;
    
    setLoading(true);
    const success = await deleteTournament(tournament.id);
    if (success) {
      triggerHaptic('success');
      router.push('/admin/tournaments');
    } else {
      triggerHaptic('error');
      alert('Failed to delete tournament.');
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Edit Form */}
      <Card className="bg-[#0d1412] border-white/5">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-display font-bold uppercase text-white mb-4">Edit Tournament</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Name</label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="bg-black/50 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Prize Pool</label>
            <Input 
              value={prizePool} 
              onChange={e => setPrizePool(e.target.value)} 
              className="bg-black/50 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-muted-foreground">Status</label>
            <div className="flex gap-2">
              {['UPCOMING', 'REGISTRATION', 'IN_PROGRESS', 'COMPLETED'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md border ${
                    status === s ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-black/30 border-white/5 text-muted-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleUpdate} 
            disabled={loading}
            className="w-full mt-4 bg-cyan-500 text-black font-bold uppercase hover:bg-cyan-400"
          >
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-950/10 border-red-500/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-display font-bold uppercase text-red-500 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" /> Danger Zone
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Deleting this tournament will permanently erase all associated matches, registrations, payments, and standings. This action cannot be undone.
          </p>
          
          <Button 
            onClick={handleDelete}
            disabled={loading}
            variant="destructive"
            className="w-full font-bold uppercase"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Tournament
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
