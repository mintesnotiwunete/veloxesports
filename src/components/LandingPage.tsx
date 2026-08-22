'use client';

import Link from 'next/link';
import { Gamepad2, Trophy, Zap, ChevronRight, MonitorPlay, Crosshair, Users, ChevronDown, Gamepad, MessageSquare, Twitter, DiscIcon as Discord } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function LandingPage() {
  const botUrl = process.env.NEXT_PUBLIC_APP_URL ? process.env.NEXT_PUBLIC_APP_URL.replace('https://', 't.me/veloxesportsbot/app') : 'https://t.me/veloxesportsbot/app';

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-[#070b0a] text-white font-sans overflow-x-hidden selection:bg-cyan-500/30 scroll-smooth">
      {/* Background glow effects */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-emerald-900/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 w-full bg-[#070b0a]/80 backdrop-blur-md z-50 border-b border-white/5">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-display font-black tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">VELOX</span>
          </div>
          
          <nav className="hidden md:flex items-center bg-[#0d1412] border border-cyan-900/50 rounded-full px-8 py-3 space-x-8 text-xs font-bold uppercase tracking-widest text-gray-400">
            <Link href="#" className="hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="#tournaments" className="hover:text-cyan-400 transition-colors">Tournaments</Link>
            <Link href="#communities" className="hover:text-cyan-400 transition-colors">Communities</Link>
            <Link href="#about" className="hover:text-cyan-400 transition-colors">About</Link>
          </nav>

          <Link href={botUrl}>
            <Button className="bg-transparent border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 rounded-sm px-8 uppercase font-bold tracking-widest text-xs box-glow">
              Join Now
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeIn} className="space-y-8 max-w-2xl">
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
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="relative w-full h-[600px] hidden lg:flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b0a] via-transparent to-transparent z-20" />
              <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" className="absolute object-cover w-full h-full opacity-40 mix-blend-luminosity border-r-4 border-cyan-500/20" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }} alt="Hero" />
            </motion.div>
          </div>
        </section>

        {/* Tournaments Section */}
        <section id="tournaments" className="container mx-auto px-6 py-24">
          <div className="flex items-center justify-center space-x-4 mb-16 opacity-80">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-cyan-500/50" />
            <div className="flex space-x-1">
               <div className="w-3 h-1 bg-cyan-500 skew-x-12" />
               <div className="w-2 h-1 bg-cyan-500 skew-x-12" />
            </div>
            <span className="text-cyan-400 font-display uppercase tracking-widest text-sm font-bold">Featured Tournaments</span>
            <div className="flex space-x-1">
               <div className="w-2 h-1 bg-cyan-500 -skew-x-12" />
               <div className="w-3 h-1 bg-cyan-500 -skew-x-12" />
            </div>
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'FC26 Winter Clash', game: 'EA Sports FC 26', prize: ',000', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600' },
              { name: 'Fortnite Royale', game: 'Fortnite', prize: ',000', img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=600' },
              { name: 'Global Showdown', game: 'FC 26', prize: ',500', img: 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=600' }
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="group relative bg-[#0d1412] rounded-2xl overflow-hidden border border-white/5 hover:border-cyan-500/50 transition-colors">
                <div className="h-48 w-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1412] to-transparent z-10" />
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal" />
                  <div className="absolute top-4 right-4 z-20 bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
                    {t.game}
                  </div>
                </div>
                <div className="p-6 relative z-20">
                  <h3 className="text-2xl font-display font-bold uppercase mb-2 text-white">{t.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-gray-400 text-sm font-medium">Prize Pool</span>
                    <span className="text-cyan-400 font-bold tracking-wider">{t.prize}</span>
                  </div>
                  <Link href={botUrl}>
                    <Button className="w-full mt-6 bg-white/5 hover:bg-cyan-500/20 text-white font-bold uppercase tracking-widest text-xs h-12 transition-colors">
                      Join Bracket
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* About / Features Section */}
        <section id="about" className="container mx-auto px-6 py-24 bg-[#0d1412]/50 border-y border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight">Everything you need all <br/>in one place</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Trophy, title: 'Tournament Hosting', desc: 'Easily create, manage, and customize your own esports tournaments directly from Telegram.' },
              { icon: Crosshair, title: 'Compete & Win', desc: 'Join high-stakes competitions instantly using Telegram Stars. No credit cards required.' },
              { icon: Zap, title: 'Real Prizes & Rewards', desc: 'Cash prizes, exclusive rewards, and global leaderboard dominance for top players.' }
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="bg-[#070b0a] border border-white/5 hover:border-cyan-500/30 p-8 rounded-2xl transition-all group">
                <div className="w-12 h-12 bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-center rounded-lg mb-6 group-hover:bg-cyan-900/50 transition-colors">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-display font-bold uppercase mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Communities Section */}
        <section id="communities" className="container mx-auto px-6 py-32 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto bg-gradient-to-b from-[#0d1412] to-[#070b0a] border border-cyan-500/20 rounded-3xl p-12 lg:p-20 relative overflow-hidden box-glow">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
            <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight mb-6 relative z-10">Join Our Community</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Connect with 10,000+ gamers, find scrim partners, and stay updated on the latest tournament announcements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-sm px-8 h-14 uppercase font-bold tracking-widest w-full sm:w-auto flex items-center gap-2">
                <Discord className="w-5 h-5" /> Discord
              </Button>
              <Button className="bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-sm px-8 h-14 uppercase font-bold tracking-widest w-full sm:w-auto flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Telegram
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050807] pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <span className="text-4xl font-display font-black tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">VELOX</span>
              <p className="text-gray-500 mt-6 max-w-sm leading-relaxed text-sm">
                The ultimate platform for competitive gaming on Telegram. Seamlessly register, compete, and get paid instantly using Telegram Stars.
              </p>
            </div>
            <div>
              <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link href="#tournaments" className="hover:text-white transition-colors">Tournaments</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Leaderboards</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Rules & FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-cyan-400 font-bold uppercase tracking-widest text-sm mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-xs uppercase tracking-widest">© 2026 Velox Esports. All Rights Reserved.</p>
            <div className="flex items-center space-x-4 text-gray-500">
              <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              <Discord className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
              <MessageSquare className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
