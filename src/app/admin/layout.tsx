import Link from 'next/link';
import { Home, Trophy, Settings, Users, ArrowLeft } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Tournaments', href: '/admin/tournaments', icon: Trophy },
    { name: 'Players', href: '/admin/players', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#070b0a] text-white flex font-sans selection:bg-cyan-500/30">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d1412] border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <span className="text-2xl font-display font-black tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">VELOX</span>
          <span className="text-xs block text-gray-500 font-bold uppercase tracking-widest mt-1">Command Center</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-gray-400 rounded-lg hover:bg-cyan-950/30 hover:text-cyan-400 hover:border hover:border-cyan-500/20 transition-all"
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto relative">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
