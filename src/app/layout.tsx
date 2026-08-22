import Script from 'next/script';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { TelegramProvider } from "@/components/TelegramProvider";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Esports Tournament Platform",
  description: "Compete, win, dominate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className + " min-h-screen bg-background text-foreground antialiased"}>
        <TelegramProvider>
          <main className="pb-20">
            {children}
          </main>
          <BottomNav />
        </TelegramProvider>
      </body>
    </html>
  );
}

