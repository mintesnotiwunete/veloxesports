'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramContextType {
  user: TelegramUser | null;
  initData: string | null;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  initData: null,
  isReady: false,
});

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initData, setInitData] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      const initDataString = tg.initData;
      const tgUser = tg.initDataUnsafe?.user as TelegramUser;
      
      if (!isReady) {
        setInitData(initDataString);
        setUser(tgUser || null);
        setIsReady(true);
      }
      
      // Setup telegram app theme matching
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
    } else {
      // Mock data for local testing outside Telegram
      if (!isReady) {
        if (process.env.NODE_ENV === 'development') {
          setUser({
            id: 12345678,
            first_name: 'Dev',
            username: 'developer',
          });
          setInitData('mock_init_data');
        }
        setIsReady(true);
      }
    }
  }, [isReady]);

  return (
    <TelegramContext.Provider value={{ user, initData, isReady }}>
      {children}
    </TelegramContext.Provider>
  );
}

export function useTelegram() {
  return useContext(TelegramContext);
}
