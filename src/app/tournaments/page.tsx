import { Trophy, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function TournamentsPage() {
  const games = ['All', 'Fortnite', 'PUBG', 'FC 26', 'Chess', 'Call of Duty'];
  
  return (
    <div className="flex flex-col min-h-screen p-4 space-y-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Tournaments</h1>
        <p className="text-muted-foreground text-sm">Find and join upcoming events</p>
      </header>

      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tournaments..." className="pl-9 bg-card" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-2">
        <div className="flex space-x-2">
          {games.map((game, i) => (
            <Badge 
              key={game} 
              variant={i === 0 ? 'default' : 'secondary'}
              className="px-4 py-1.5 cursor-pointer text-sm font-medium"
            >
              {game}
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>

      <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <Trophy className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">More tournaments coming soon</h3>
        <p className="text-muted-foreground text-sm max-w-[250px]">
          Check back later for new events or try adjusting your filters.
        </p>
      </div>
    </div>
  );
}
