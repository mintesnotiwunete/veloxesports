'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Megaphone } from 'lucide-react';
import { createAnnouncement } from '@/app/actions';
import { triggerHaptic } from '@/lib/haptics';

export function AdminAnnouncementForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('INFO');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    
    setLoading(true);
    const res = await createAnnouncement(title, content, type);
    if (res) {
      triggerHaptic('success');
      setSuccess(true);
      setTitle('');
      setContent('');
      setTimeout(() => setSuccess(false), 3000);
    } else {
      triggerHaptic('error');
    }
    setLoading(false);
  };

  return (
    <Card className="bg-[#0d1412] border-white/5 h-full">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-display font-black uppercase text-white tracking-wide">Broadcast Message</h3>
            <p className="text-xs text-muted-foreground">Push an announcement to the Home Hub</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</label>
            <Input 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Server Maintenance"
              className="bg-black/50 border-white/10"
              maxLength={40}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Keep it brief (max 150 chars)"
              className="w-full bg-black/50 border border-white/10 rounded-md p-3 text-sm min-h-[80px]"
              maxLength={150}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Alert Type</label>
            <div className="flex gap-2">
              {['INFO', 'WARNING', 'SUCCESS'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md border transition-all ${
                    type === t ? 'bg-cyan-950/50 border-cyan-500 text-cyan-400' : 'bg-black/30 border-white/5 text-muted-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading || !title || !content} className="w-full bg-cyan-500 text-black font-bold uppercase tracking-widest hover:bg-cyan-400 h-12">
            {loading ? 'Broadcasting...' : success ? 'Sent!' : 'Send Broadcast'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
