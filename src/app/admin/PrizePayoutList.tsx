'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Check, Clock, ExternalLink } from 'lucide-react';
import { processPayout } from '@/app/actions';
import { triggerHaptic } from '@/lib/haptics';

export function PrizePayoutList({ initialPayouts }: { initialPayouts: any[] }) {
  const [payouts, setPayouts] = useState(initialPayouts);
  const [processing, setProcessing] = useState<string | null>(null);

  const handleProcess = async (payoutId: string) => {
    setProcessing(payoutId);
    const res = await processPayout(payoutId, 'PAID');
    if (res) {
      triggerHaptic('success');
      setPayouts(prev => prev.map(p => p.id === payoutId ? { ...p, status: 'PAID' } : p));
    } else {
      triggerHaptic('error');
    }
    setProcessing(null);
  };

  if (payouts.length === 0) {
    return (
      <Card className="bg-glass border-white/5 border-dashed">
        <CardContent className="p-8 text-center flex flex-col items-center">
          <Coins className="w-8 h-8 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-bold text-muted-foreground">No Prize Payouts</p>
          <p className="text-xs text-muted-foreground mt-1">Tournament winners have not been assigned prizes yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {payouts.map(payout => (
        <Card key={payout.id} className={`border ${payout.status === 'PAID' ? 'bg-black/40 border-white/5 opacity-60' : 'bg-emerald-950/20 border-emerald-500/30 overflow-hidden box-glow'}`}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${payout.status === 'PAID' ? 'bg-black border-white/10' : 'bg-emerald-950/40 border-emerald-500/30'}`}>
                <Coins className={`w-5 h-5 ${payout.status === 'PAID' ? 'text-muted-foreground' : 'text-emerald-400'}`} />
              </div>
              <div>
                <p className={`text-sm font-black uppercase ${payout.status === 'PAID' ? 'text-muted-foreground' : 'text-white'}`}>{payout.amount} Stars</p>
                <p className="text-[10px] text-cyan-400 font-bold uppercase">{payout.user?.firstName} {payout.user?.telegramUsername ? `(@${payout.user.telegramUsername})` : ''}</p>
                <p className="text-[9px] text-muted-foreground uppercase">{payout.tournament?.name}</p>
              </div>
            </div>
            
            <div>
              {payout.status === 'PAID' ? (
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center text-[10px] text-emerald-400 font-bold uppercase">
                    <Check className="w-3 h-3 mr-1" /> Paid
                  </div>
                  <a href="#" className="text-[9px] text-muted-foreground flex items-center hover:underline">
                    View Tx <ExternalLink className="w-2 h-2 ml-1" />
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center text-[10px] text-yellow-500 font-bold uppercase">
                    <Clock className="w-3 h-3 mr-1" /> Processing
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleProcess(payout.id)}
                    disabled={processing === payout.id}
                    className="h-7 text-[10px] font-bold uppercase bg-emerald-500 text-black hover:bg-emerald-400"
                  >
                    Mark Paid
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
