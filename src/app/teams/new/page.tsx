'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTelegram } from '@/components/TelegramProvider';
import { ArrowLeft, Loader2, ShieldPlus } from 'lucide-react';
import Link from 'next/link';
import { createTeam } from '@/app/team-actions';

export default function NewTeamPage() {
  const router = useRouter();
  const { user, isReady } = useTelegram();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Telegram user not connected");
      return;
    }
    
    if (formData.name.trim().length < 3) {
      setError("Squad name must be at least 3 characters");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const team = await createTeam(user.id, formData.name, formData.description, formData.logoUrl);
      
      if (team) {
        router.push(`/teams/${team.slug}`);
      } else {
        setError("Failed to create squad. Name might be taken.");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("An error occurred");
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="bg-[#111111] p-4 sticky top-0 z-10 border-b border-white/5 flex items-center gap-4">
        <Link href="/teams">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-black uppercase tracking-wider text-white">Form Squad</h1>
        </div>
      </div>

      <div className="p-4">
        <Card className="bg-[#1a1a1a] border-white/5 rounded-sm">
          <CardHeader>
            <CardTitle className="text-cyan-400 uppercase tracking-widest text-sm flex items-center gap-2">
              <ShieldPlus className="w-4 h-4" /> Squad Details
            </CardTitle>
            <CardDescription className="text-slate-400">
              Create a new faction and recruit players.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300 font-bold uppercase tracking-wider text-xs">Squad Name</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-black border-white/10 text-white rounded-sm h-12 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="e.g. FaZe Clan"
                  maxLength={30}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo" className="text-slate-300 font-bold uppercase tracking-wider text-xs">Logo URL (Optional)</Label>
                <Input 
                  id="logo"
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({...formData, logoUrl: e.target.value})}
                  className="bg-black border-white/10 text-white rounded-sm h-12 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300 font-bold uppercase tracking-wider text-xs">Description</Label>
                <Textarea 
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-black border-white/10 text-white rounded-sm min-h-[100px] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
                  placeholder="Tell us about your squad..."
                  maxLength={500}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-950/50 border border-red-500/50 rounded-sm text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest h-12 rounded-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Establish Squad'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
