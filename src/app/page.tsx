import Link from "next/link";

const features = [
  {
    href: "/search",
    emoji: "🔍",
    title: "Paddle Encyclopedia",
    desc: "Browse 400+ paddles with instant search, filters, and detailed stats.",
    color: "from-lime-50 to-green-50",
    border: "hover:border-lime-300",
  },
  {
    href: "/compare",
    emoji: "⚖️",
    title: "Compare Paddles",
    desc: "Put up to 5 paddles side-by-side. See which stats win at a glance.",
    color: "from-emerald-50 to-teal-50",
    border: "hover:border-emerald-300",
  },
  {
    href: "/quiz",
    emoji: "🎯",
    title: "Paddle Quiz",
    desc: "Answer 7 quick questions and we'll recommend your perfect paddle.",
    color: "from-green-50 to-lime-50",
    border: "hover:border-green-300",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-lime-500 via-green-500 to-emerald-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl animate-bounce-subtle">🏓</div>
          <div className="absolute bottom-20 right-20 text-7xl animate-bounce-subtle stagger-2">🏓</div>
          <div className="absolute top-1/2 left-1/2 text-6xl animate-bounce-subtle stagger-3">🏓</div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight animate-fade-in">
            Find Your Perfect Paddle
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto animate-fade-in stagger-1">
            Search 400+ pickleball paddles, compare specs side-by-side, or take our quiz to discover your ideal match.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in stagger-2">
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-700 font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              🎯 Take the Quiz
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur text-white font-semibold px-8 py-3.5 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-200"
            >
              🔍 Browse Paddles
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Link
              key={f.href}
              href={f.href}
              className={`group relative block rounded-2xl border border-gray-200 ${f.border} bg-gradient-to-br ${f.color} p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up stagger-${i + 1}`}
            >
              <div className="text-4xl mb-4">{f.emoji}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              <div className="mt-4 text-lime-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                Get started →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: "437", label: "Paddles" },
            { val: "56", label: "Brands" },
            { val: "20", label: "Stats Tracked" },
            { val: "100%", label: "Free" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-lime-600">{s.val}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
