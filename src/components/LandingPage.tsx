import Link from 'next/link';
import { Gamepad2, Trophy, Zap, ChevronRight, MonitorPlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function LandingPage() {
  const botUrl = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL.replace('https://', 't.me/veloxesportsbot/app') : 'https://t.me/veloxesportsbot/app';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b border-primary/20 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MonitorPlay className="w-8 h-8 text-primary" />
            <span className="text-2xl font-display font-black italic uppercase tracking-wider text-glow">Velox</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#games" className="hover:text-primary transition-colors">Games</Link>
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
          </nav>
          <Link href={botUrl}>
            <Button className="font-display font-bold uppercase tracking-widest text-lg box-glow">
              Play Now
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none" />
        
        <Badge className="mb-6 bg-primary/10 text-primary border-primary/50 text-sm px-4 py-1 uppercase tracking-widest">
          The Future of Telegram Esports
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-display font-black italic uppercase leading-tight mb-6 max-w-4xl">
          Compete, Win, and Get Paid in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white text-glow">Telegram</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl">
          Join automated daily tournaments for FC26, Fortnite, and Chess directly inside Telegram. Instant entry fees with Telegram Stars. Instant payouts.
        </p>

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 z-10">
          <Link href={botUrl} className="w-full sm:w-auto">
            <Button size="lg" className="h-16 px-10 text-xl font-display font-black italic uppercase tracking-widest box-glow w-full">
              Launch Mini App <ChevronRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>
          <Link href="https://t.me/veloxesportsbot" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="h-16 px-10 text-xl font-display font-bold uppercase tracking-widest border-primary/50 hover:bg-primary/10 w-full">
              Join Community
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl mx-auto z-10">
          <div className="bg-glass p-8 rounded-2xl border border-primary/20 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 box-glow">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-bold uppercase mb-4">Instant Registration</h3>
            <p className="text-muted-foreground">Pay entry fees securely using Telegram Stars in one tap. No credit cards needed.</p>
          </div>
          
          <div className="bg-glass p-8 rounded-2xl border border-primary/20 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 box-glow">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-bold uppercase mb-4">Automated Brackets</h3>
            <p className="text-muted-foreground">Our engine automatically seeds players, tracks scores, and advances winners in real-time.</p>
          </div>

          <div className="bg-glass p-8 rounded-2xl border border-primary/20 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 box-glow">
              <Gamepad2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-bold uppercase mb-4">Multiple Games</h3>
            <p className="text-muted-foreground">From 1v1 FC26 matches to 256-player Fortnite Battle Royales, we host it all.</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 Velox Esports. All rights reserved.</p>
      </footer>
    </div>
  );
}
