'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      <h1 className="text-3xl font-display font-bold uppercase tracking-wider">Create Tournament</h1>
      
      <Card className="bg-glass border-white/5">
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Tournament Name</label>
              <Input name="name" required className="bg-background/50 border-white/10 focus-visible:ring-primary" placeholder="e.g. Summer Showdown" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Entry Fee (Stars)</label>
                <Input name="entryFeeStars" type="number" required defaultValue="50" className="bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Prize Pool</label>
                <Input name="prizePool" required defaultValue="" className="bg-background/50 border-white/10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Max Players</label>
                <Input name="maxPlayers" type="number" required defaultValue="64" className="bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Game ID (slug)</label>
                <Input name="gameSlug" required defaultValue="fc26" className="bg-background/50 border-white/10" />
              </div>
            </div>

            <Button disabled={loading} type="submit" className="w-full font-bold uppercase tracking-widest box-glow mt-4">
              {loading ? 'Creating...' : 'Launch Tournament'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
