import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // In a real app, verify admin status here
  // redirect('/') if not admin

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 border-r border-border bg-card p-4 hidden md:block">
        <h2 className="text-xl font-black italic mb-6 text-primary">ESPORTS ADMIN</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="block p-2 rounded hover:bg-muted">Dashboard</Link>
          <Link href="/admin/tournaments" className="block p-2 rounded hover:bg-muted">Tournaments</Link>
          <Link href="/admin/games" className="block p-2 rounded hover:bg-muted">Games</Link>
          <Link href="/admin/players" className="block p-2 rounded hover:bg-muted">Players</Link>
          <Link href="/admin/payments" className="block p-2 rounded hover:bg-muted">Payments</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
