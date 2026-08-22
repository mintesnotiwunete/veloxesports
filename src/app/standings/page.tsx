import { Trophy } from 'lucide-react';

export default function StandingsPage() {
  return (
    <div className="flex flex-col min-h-screen p-4 space-y-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Standings</h1>
        <p className="text-muted-foreground text-sm">Global leaderboards and rankings</p>
      </header>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
          <h2 className="text-lg font-semibold text-muted-foreground">Rankings will appear here</h2>
        </div>
      </div>
    </div>
  );
}
