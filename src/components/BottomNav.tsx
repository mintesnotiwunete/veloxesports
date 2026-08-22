'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trophy, Crown, User, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTelegram } from './TelegramProvider';
import { triggerHaptic } from '@/lib/haptics';

export function BottomNav() {
  const pathname = usePathname();
  const { initData, isReady } = useTelegram();

  // Hide BottomNav if we are on the admin page, or if we are not inside Telegram
  if (pathname?.startsWith('/admin')) return null;
  
  if (process.env.NODE_ENV === 'production' && !initData) return null;
  // in dev, we might mock initData, but if it's explicitly null, hide it to test landing page
  if (!initData) return null;

  const navItems = [
    { href: '/', icon: Home, label: 'Hub' },
    { href: '/tournaments', icon: Trophy, label: 'Compete' },
    { href: '/matches', icon: Swords, label: 'Matches' },
    { href: '/standings', icon: Crown, label: 'Rankings' },
    { href: '/profile', icon: User, label: 'Passport' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 pointer-events-none">
      <nav className="mx-auto max-w-md bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl pointer-events-auto box-glow">
        <ul className="flex justify-between items-center relative">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="flex-1 relative z-10">
                <Link
                  href={item.href}
                  onClick={() => triggerHaptic('light')}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 transition-all duration-300",
                    isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-white"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 mb-1 transition-all duration-300", isActive && "drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]")} />
                  <span className="text-[9px] font-display font-bold uppercase tracking-wider">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
