'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function NewTournamentForm({ games }: { games: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedGameSlug, setSelectedGameSlug] = useState(games[0]?.slug || '');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Inject the selected game slug since it's in the Select component state
    data.gameSlug = selectedGameSlug;

    try {
      const res = await fetch('/api/admin/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const dataResponse = await res.json();
      if (!res.ok) throw new Error(dataResponse.error || 'Failed to create tournament');
      router.push('/admin/tournaments');
      router.refresh();
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tournament Name</label>
        <Input name="name" required className="bg-[#070b0a] border-white/10 focus-visible:ring-cyan-500 text-white" placeholder="e.g. Addis Cyber Cup" />
      </div>
      
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Banner / Cover Image URL</label>
        <Input name="bannerUrl" className="bg-[#070b0a] border-white/10 focus-visible:ring-cyan-500 text-white" placeholder="https://example.com/image.jpg (Optional)" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Entry Fee (Stars)</label>
          <Input name="entryFeeStars" type="number" required defaultValue="50" className="bg-[#070b0a] border-white/10 focus-visible:ring-cyan-500 text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Prize Pool (Birr)</label>
          <Input name="prizePool" required defaultValue="10,000 Birr" className="bg-[#070b0a] border-white/10 focus-visible:ring-cyan-500 text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max Players</label>
          <Input name="maxPlayers" type="number" required defaultValue="64" className="bg-[#070b0a] border-white/10 focus-visible:ring-cyan-500 text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Game</label>
          <Select value={selectedGameSlug} onValueChange={(val) => setSelectedGameSlug(val || '')}>
            <SelectTrigger className="bg-[#070b0a] border-white/10 text-white">
              <SelectValue placeholder="Select Game" />
            </SelectTrigger>
            <SelectContent>
              {games.map(g => (
                <SelectItem key={g.id} value={g.slug}>{g.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Registration Closes</label>
          <Input name="registrationEnd" type="datetime-local" required className="bg-[#070b0a] border-white/10 focus-visible:ring-cyan-500 text-white css-invert-calendar" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start Time</label>
          <Input name="startTime" type="datetime-local" required className="bg-[#070b0a] border-white/10 focus-visible:ring-cyan-500 text-white css-invert-calendar" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">End Time (Optional)</label>
          <Input name="endTime" type="datetime-local" className="bg-[#070b0a] border-white/10 focus-visible:ring-cyan-500 text-white css-invert-calendar" />
        </div>
      </div>

      <Button disabled={loading} type="submit" className="w-full bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/60 rounded-sm font-bold uppercase tracking-widest text-sm transition-all box-glow mt-4 h-12">
        {loading ? 'Deploying...' : 'Launch Tournament'}
      </Button>
    </form>
  );
}
