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
    <div className="min-h-screen bg-[#070b0a] text-white flex flex-col md:flex-row font-sans selection:bg-cyan-500/30">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0d1412] border-b md:border-b-0 md:border-r border-white/5 flex flex-col sticky top-0 z-50 md:h-screen md:sticky">
        <div className="p-4 md:p-6 border-b border-white/5 flex justify-between items-center md:block">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <img src="/logo.png" alt="Velox Logo" className="w-8 h-8 rounded-lg hidden md:block" />
              <span className="text-xl md:text-2xl font-display font-black tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">VELOX</span>
            </div>
            <span className="text-[10px] md:text-xs block text-gray-500 font-bold uppercase tracking-widest mt-1">Command Center</span>
          </div>
          <div className="md:hidden">
            {/* Mobile Exit Button */}
            <Link href="/" className="flex items-center justify-center p-2 text-gray-500 hover:text-white bg-black/30 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
        
        <nav className="flex-1 p-2 md:p-4 flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 md:space-x-3 px-3 py-2 md:px-4 md:py-3 text-[10px] md:text-sm font-bold uppercase tracking-wider text-gray-400 rounded-lg hover:bg-cyan-950/30 hover:text-cyan-400 hover:border hover:border-cyan-500/20 transition-all whitespace-nowrap"
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block p-4 border-t border-white/5">
          <Link href="/" className="flex items-center space-x-3 px-4 py-3 text-sm font-bold uppercase tracking-wider text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto relative min-h-[calc(100vh-80px)] md:min-h-screen">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />
        
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
