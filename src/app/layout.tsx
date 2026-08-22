import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import { TelegramProvider } from "@/components/TelegramProvider";
import { BottomNav } from "@/components/BottomNav";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const rajdhani = Rajdhani({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"], 
  variable: "--font-rajdhani" 
});

export const metadata: Metadata = {
  title: "Velox Esports",
  description: "Next-gen Telegram Esports Platform",
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
      <body className={"min-h-screen bg-background text-foreground antialiased pb-20   font-sans"}>
        <TelegramProvider>
          {children}
          <BottomNav />
        </TelegramProvider>
      </body>
    </html>
  );
}
