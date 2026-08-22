import Link from 'next/link';
import { Gamepad2, Trophy, Zap, ChevronRight, MonitorPlay, Crosshair, Users, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  const botUrl = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL.replace('https://', 't.me/veloxesportsbot/app') : 'https://t.me/veloxesportsbot/app';

  return (
    <div className="min-h-screen bg-[#070b0a] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-emerald-900/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      {/* Navbar */}
      <header className="container mx-auto px-6 h-24 flex items-center justify-between relative z-50">
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-display font-black tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">VELOX</span>
        </div>
        
        <nav className="hidden md:flex items-center bg-[#0d1412] border border-cyan-900/50 rounded-full px-8 py-3 space-x-8 text-xs font-bold uppercase tracking-widest text-gray-400">
          <Link href="#" className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Home</Link>
          <Link href="#" className="hover:text-white transition-colors">Tournaments</Link>
          <Link href="#" className="hover:text-white transition-colors">Communities</Link>
          <Link href="#" className="hover:text-white transition-colors">About</Link>
        </nav>

        <Link href={botUrl}>
          <Button className="bg-transparent border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-sm px-8 uppercase font-bold tracking-widest text-xs box-glow">
            Join Now
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column */}
          <div className="space-y-8 max-w-2xl">
            <h1 className="text-6xl lg:text-7xl font-display font-black uppercase leading-[0.9] tracking-tighter drop-shadow-2xl">
              Enter The <br />
              Arena. Prove <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-500 drop-shadow-[0_0_30px_rgba(0,255,255,0.3)]">Your Skill</span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-md font-medium leading-relaxed">
              Compete in high-stakes tournaments across the world's most exciting titles. Join thousands of players battling for glory, cash prizes, and recognition.
            </p>

            <Link href={botUrl} className="inline-block">
              <Button size="lg" className="bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/60 rounded-sm px-10 h-14 text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 box-glow">
                Register Now
              </Button>
            </Link>
          </div>

          {/* Right Column (Hero Graphic) */}
          <div className="relative w-full h-[600px] hidden lg:flex items-center justify-center">
            {/* Mockup character / abstract graphic */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a] via-transparent to-transparent z-20" />
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" className="absolute object-cover w-full h-full opacity-40 mix-blend-luminosity border-r-4 border-cyan-500/20" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }} alt="Hero" />
          </div>
        </div>

        {/* Section Divider */}
        <div className="flex items-center justify-center space-x-4 mt-24 opacity-80">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-cyan-500/50" />
          <div className="flex space-x-1">
             <div className="w-3 h-1 bg-cyan-500 skew-x-12" />
             <div className="w-2 h-1 bg-cyan-500 skew-x-12" />
             <div className="w-1 h-1 bg-cyan-500 skew-x-12" />
          </div>
          <span className="text-cyan-400 font-display uppercase tracking-widest text-sm font-bold">Featured Tournaments</span>
          <div className="flex space-x-1">
             <div className="w-1 h-1 bg-cyan-500 -skew-x-12" />
             <div className="w-2 h-1 bg-cyan-500 -skew-x-12" />
             <div className="w-3 h-1 bg-cyan-500 -skew-x-12" />
          </div>
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-cyan-500/50" />
        </div>

        {/* Features Grid (Glassmorphism) */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight">Everything you need all <br/>in one place</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Trophy, title: 'Tournament Hosting', desc: 'Easily create, manage, and customize your own esports tournaments.' },
              { icon: Crosshair, title: 'Compete & Win', desc: 'Join high-stakes competitions and prove your skills.' },
              { icon: Zap, title: 'Real Prizes & Rewards', desc: 'Cash prizes, exclusive rewards, and leaderboard dominance.' }
            ].map((feature, i) => (
              <div key={i} className="bg-[#0d1412]/80 backdrop-blur-md border border-white/5 hover:border-cyan-500/30 p-8 rounded-2xl transition-all group">
                <div className="w-12 h-12 bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-center rounded-lg mb-6 group-hover:bg-cyan-900/50 transition-colors">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-display font-bold uppercase mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-[#0a0f0e] py-12">
        <div className="container mx-auto px-6 text-center">
          <span className="text-3xl font-display font-black tracking-widest text-white/20 uppercase">VELOX</span>
          <p className="text-gray-600 text-xs uppercase tracking-widest mt-4">© 2026 Velox Esports. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
