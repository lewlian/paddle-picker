import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wikipickle 🏓 — The Pickleball Paddle Encyclopedia",
  description: "Search, compare, and discover your ideal pickleball paddle from 400+ paddles. Take our quiz to find the perfect match.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
              <span className="text-2xl">🏓</span>
              <span>Wikipickle</span>
            </a>
            <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <a href="/search" className="hover:text-lime-600 transition-colors">Search</a>
              <a href="/compare" className="hover:text-lime-600 transition-colors">Compare</a>
              <a href="/quiz" className="hover:text-lime-600 transition-colors">Quiz</a>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
          🏓 Wikipickle — Built for pickleball lovers
        </footer>
      </body>
    </html>
  );
}
