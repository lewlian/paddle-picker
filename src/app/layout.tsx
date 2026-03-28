import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PromoBanner from "@/components/PromoBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wikipickle 🥒 — The Pickleball Paddle Encyclopedia",
  description: "Search, compare, and discover your ideal pickleball paddle from 400+ paddles. Take our quiz to find the perfect match.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAF6F0] text-[#1A1A1A]">
        <nav className="sticky top-0 z-50 bg-[#FAF6F0]/80 backdrop-blur-md border-b border-[#1A4D2E]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity shrink-0">
              <span className="text-xl sm:text-2xl">🥒</span>
              <span className="font-display font-bold text-base sm:text-xl text-[#1A1A1A]">Wikipickle</span>
            </a>
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden sm:flex items-center gap-5 text-sm font-medium text-[#1A1A1A]">
                <a href="/search" className="hover:text-[#1A4D2E] transition-colors">Search</a>
                <a href="/compare" className="hover:text-[#1A4D2E] transition-colors">Compare</a>
              </div>
              <div className="flex sm:hidden items-center gap-3 text-xs font-medium text-[#1A1A1A]">
                <a href="/search" className="hover:text-[#1A4D2E] transition-colors">Search</a>
                <a href="/compare" className="hover:text-[#1A4D2E] transition-colors">Compare</a>
              </div>
              <a
                href="/quiz"
                className="bg-[#1A4D2E] text-white text-xs sm:text-sm font-semibold px-3 sm:px-5 py-1.5 sm:py-2 rounded-full hover:bg-[#153D24] transition-colors whitespace-nowrap"
              >
                Take Quiz
              </a>
            </div>
          </div>
        </nav>
        <PromoBanner />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#1A4D2E]/5 py-8 text-center text-sm text-[#6B6B6B]">
          <span className="font-display">🥒 Wikipickle</span> — Built for pickleball lovers ✦
        </footer>
      </body>
    </html>
  );
}
