'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, BarChart2, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Tournaments', href: '/tournaments', icon: Trophy },
    { name: 'Standings', href: '/standings', icon: BarChart2 },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  // Hide nav on certain pages if needed, e.g., admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-background/80 backdrop-blur-md pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon size={20} className={cn(isActive && "stroke-[2.5px]")} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
