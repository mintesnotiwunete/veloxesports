import Link from 'next/link';
import { Shield, LayoutDashboard, Trophy, Users, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-glass border-r border-white/5 flex flex-col">
        <div className="p-6 flex items-center space-x-2 border-b border-white/5">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-xl font-display font-black italic uppercase tracking-wider text-glow">Admin</span>
        </div>
        <nav className="flex-1 p-4 flex flex-col space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground font-medium">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/tournaments" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground font-medium">
            <Trophy className="w-5 h-5" />
            <span>Tournaments</span>
          </Link>
          <Link href="/admin/players" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground font-medium">
            <Users className="w-5 h-5" />
            <span>Players</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground font-medium mt-auto">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
