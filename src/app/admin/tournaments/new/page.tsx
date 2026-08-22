'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function NewTournament() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

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
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tournament Name</label>
              <Input name="name" required className="bg-[#070b0a] border-white/10 focus-visible:ring-cyan-500 text-white" placeholder="e.g. Summer Showdown" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Entry Fee (Stars)</label>
                <Input name="entryFeeStars" type="number" required defaultValue="50" className="bg-[#070b0a] border-white/10 focus-visible:ring-cyan-500 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Prize Pool</label>
                <Input name="prizePool" required defaultValue="" className="bg-[#070b0a] border-white/10 focus-visible:ring-cyan-500 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max Players</label>
                <Input name="maxPlayers" type="number" required defaultValue="64" className="bg-[#070b0a] border-white/10 focus-visible:ring-cyan-500 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Game ID (slug)</label>
                <Input name="gameSlug" required defaultValue="fc26" className="bg-[#070b0a] border-white/10 focus-visible:ring-cyan-500 text-white" />
              </div>
            </div>

            <Button disabled={loading} type="submit" className="w-full bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/60 rounded-sm font-bold uppercase tracking-widest text-sm transition-all box-glow mt-4 h-12">
              {loading ? 'Deploying...' : 'Launch Tournament'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
