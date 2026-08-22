'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, ListOrdered, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: Home, label: 'Hub' },
    { href: '/tournaments', icon: Trophy, label: 'Tourneys' },
    { href: '/standings', icon: ListOrdered, label: 'Ranks' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <nav className="flex items-center justify-around bg-background/70 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-lg shadow-black/50">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary bg-primary/10 box-glow" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-0.5", isActive && "drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]")} />
              <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
