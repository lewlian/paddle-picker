import Link from "next/link";
import paddlesRaw from "@/data/paddles.json";
import { Paddle } from "@/types/paddle";

const paddles = paddlesRaw as Paddle[];

// Pick 4 popular paddles for the "Top Picks" section
const topPicks = paddles
  .filter(p => p.image_url && p.swingweight && p.twistweight && p.spin_rpm && p.power_mph)
  .slice(0, 4);

export default function Home() {
  return (
    <div>
      {/* Bento Grid Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px] md:auto-rows-[240px]">
          {/* Large Hero Card - spans 2 cols */}
          <div className="md:col-span-2 md:row-span-2 bg-[#F2B63C] rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-[#1A4D2E] text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ✦ 437+ Paddles
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-[1.1] mb-4">
                FIND YOUR<br />PERFECT<br />PADDLE
              </h1>
              <p className="text-[#1A1A1A]/70 text-base sm:text-lg max-w-md mb-6">
                Search, compare specs, or take our quiz to discover your ideal pickleball paddle.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 bg-[#1A4D2E] text-white font-semibold px-7 py-3 rounded-full hover:bg-[#153D24] transition-colors shadow-warm"
                >
                  Take the Quiz ✦
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 bg-white/60 text-[#1A1A1A] font-semibold px-7 py-3 rounded-full hover:bg-white/80 transition-colors"
                >
                  Browse All →
                </Link>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute bottom-4 right-6 text-8xl opacity-20 select-none">🥒</div>
          </div>

          {/* Top-right: Quiz Card */}
          <Link href="/quiz" className="group bg-[#A8D4E6] rounded-3xl p-7 flex flex-col justify-between hover:shadow-warm-lg transition-all duration-300">
            <div>
              <span className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-wide">✧ Interactive</span>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A] mt-2 leading-tight">QUIZ</h2>
              <p className="text-[#1A1A1A]/60 text-sm mt-2">7 quick questions to find your perfect match</p>
            </div>
            <div className="text-[#1A4D2E] font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Start Quiz →
            </div>
          </Link>

          {/* Bottom-right: Compare Card */}
          <Link href="/compare" className="group bg-[#E8845C] rounded-3xl p-7 flex flex-col justify-between hover:shadow-warm-lg transition-all duration-300">
            <div>
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">✧ Side by Side</span>
              <h2 className="font-display text-2xl font-bold text-white mt-2 leading-tight">COMPARE</h2>
              <p className="text-white/70 text-sm mt-2">Put up to 5 paddles head-to-head</p>
            </div>
            <div className="text-white font-semibold text-sm group-hover:translate-x-1 transition-transform">
              Compare Now →
            </div>
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white/50 border-y border-[#1A4D2E]/5">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: "437", label: "Paddles" },
            { val: "56", label: "Brands" },
            { val: "20", label: "Stats Tracked" },
            { val: "100%", label: "Free" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl font-bold text-[#1A4D2E]">{s.val}</div>
              <div className="text-sm text-[#6B6B6B] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Picks */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 bg-[#1A4D2E] text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            ✦ Featured
          </span>
          <h2 className="font-display text-3xl font-bold text-[#1A1A1A]">Top Picks</h2>
          <p className="text-[#6B6B6B] mt-2">Popular paddles loved by players</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {topPicks.map((p, i) => (
            <div
              key={i}
              className="bg-[#FFFDF9] rounded-2xl border border-[#1A4D2E]/5 shadow-warm hover:shadow-warm-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="bg-[#FAF6F0] flex items-center justify-center" style={{ height: 150 }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={`${p.brand} ${p.paddle_name}`} className="h-full w-full object-contain p-3" loading="lazy" />
                ) : (
                  <span className="text-4xl">🥒</span>
                )}
              </div>
              <div className="p-4">
                <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-wide mb-1">{p.brand}</div>
                <h3 className="font-bold text-sm text-[#1A1A1A] leading-tight mb-2">{p.paddle_name}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {p.paddle_type && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A4D2E] text-white font-medium">{p.paddle_type}</span>
                  )}
                  {p.shape && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1A1A1A]/5 text-[#6B6B6B]">{p.shape.trim()}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-[#1A4D2E] text-white font-semibold px-7 py-3 rounded-full hover:bg-[#153D24] transition-colors"
          >
            View All Paddles →
          </Link>
        </div>
      </section>
    </div>
  );
}
