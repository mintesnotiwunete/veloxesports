import Link from 'next/link';
import { Gamepad2, ShieldCheck, Zap, Server, ChevronRight, PlayCircle, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function LandingPage() {
  const botUrl = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL.replace('https://', 't.me/veloxesportsbot/app') : 'https://t.me/veloxesportsbot/app';

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-rose-500/30">
      {/* Navbar */}
      <header className="container mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">VeloxEsports</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <Link href="#" className="hover:text-slate-900">Hosting Server</Link>
          <Link href="#" className="hover:text-slate-900">Game Server</Link>
          <Link href="#" className="hover:text-slate-900">Blog</Link>
        </nav>

        <div className="flex items-center space-x-6">
          <Link href="#" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-slate-900">Sign up</Link>
          <Link href={botUrl}>
            <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6 font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <div className="space-y-8 max-w-xl">
            <div className="flex items-center space-x-2 text-rose-500 font-semibold text-sm">
              <Server className="w-4 h-4" />
              <span>Next Generation Esports</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Best Premium <br />
              Gaming <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">Tournaments</span>
            </h1>
            
            <p className="text-lg font-semibold text-slate-600">
              Entry Fees Starting from <span className="text-rose-500">50 Stars</span>
            </p>

            <Link href={botUrl} className="inline-block">
              <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 h-14 text-lg font-semibold flex items-center group">
                Play in Telegram <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            {/* Social Proof */}
            <div className="pt-8 flex items-center space-x-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                    <img src={"https://i.pravatar.cc/100?img=\\"} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">Trusted by Over 2500+ User</span>
                <div className="flex text-yellow-400 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Hero Graphic) */}
          <div className="relative w-full h-[600px] bg-gradient-to-br from-purple-100 via-pink-100 to-rose-50 rounded-[3rem] p-12 flex flex-col items-center justify-center overflow-hidden shadow-2xl shadow-rose-900/5">
            {/* Decorative background blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-200/40 blur-3xl rounded-full" />
            
            <div className="relative z-10 flex items-center space-x-6 w-full justify-center">
              {/* Left Card */}
              <div className="w-48 h-64 bg-white rounded-3xl shadow-xl transform -rotate-12 translate-y-12 overflow-hidden border-4 border-white">
                <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Game" />
              </div>
              
              {/* Center Card */}
              <div className="w-64 h-80 bg-white rounded-3xl shadow-2xl z-20 overflow-hidden border-4 border-white flex flex-col">
                <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=400" className="w-full h-48 object-cover" alt="Game" />
                <div className="p-4 bg-white flex-1 flex flex-col items-center justify-center text-center">
                  <h3 className="font-bold text-lg text-slate-900">Winter Clash</h3>
                  <p className="text-xs text-slate-500 mt-1">Prize Pool: ,000</p>
                </div>
              </div>

              {/* Right Card */}
              <div className="w-48 h-64 bg-white rounded-3xl shadow-xl transform rotate-12 translate-y-12 overflow-hidden border-4 border-white">
                <img src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Game" />
              </div>
            </div>

            <div className="mt-16 text-center z-10">
              <h2 className="text-2xl font-bold text-slate-900">Daily Competitions</h2>
              <p className="text-slate-600 font-medium mt-2 max-w-sm">Our premium tournaments begin at <span className="text-rose-500 font-bold">50 Stars</span> & are the perfect place to compete.</p>
              <Button className="mt-6 bg-rose-500 hover:bg-rose-600 text-white rounded-full px-8 shadow-lg shadow-rose-500/30">
                View Schedule
              </Button>
            </div>
          </div>

        </div>
      </main>

      {/* Logos Section */}
      <section className="border-y border-slate-100 bg-slate-50/50 py-12">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm font-semibold text-slate-500 mb-8">See how over 7,700+ Customers <span className="text-rose-500">Help the world work</span></p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale">
            <span className="font-bold text-2xl tracking-tighter">AIRTABLE</span>
            <span className="font-bold text-2xl tracking-tighter">SPOTIFY</span>
            <span className="font-bold text-2xl tracking-tighter">DIGITALOCEAN</span>
            <span className="font-bold text-2xl tracking-tighter">MONDAY.COM</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">Why We are the <br />Best Platform?</h2>
            <p className="text-slate-600 leading-relaxed">Our Telegram Esports plans begin at <span className="text-rose-500 font-semibold">.99</span>, and are the perfect servers for you and your friends to fully experience competitive gaming.</p>
            <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-8 mt-4">
              Discover Plans
            </Button>
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Advanced Security</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Whether it's for a competitive match, or just a casual game with friends, we ensure secure payouts and fair play.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Top Class Performance</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Whether it's for a competitive match, or just a casual game with friends, our automated bracket engine is the fastest.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Unlimited Scaling</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Whether it's for a competitive match, or just a casual game with friends, we support up to 10,000 players per tournament.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mb-6">
                <Server className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">World Class Servers</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Whether it's for a competitive match, or just a casual game with friends, our backend is unmatched.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
