"use client";
import Link from "next/link";
import { useState } from "react";
import paddlesRaw from "@/data/paddles.json";
import { Paddle, formatStat, statLabels } from "@/types/paddle";
import PaddleCard, { PaddleImage } from "@/components/PaddleCard";
import Tooltip, { getStatTooltip, getBuildStyleTooltip } from "@/components/Tooltip";

const paddles = paddlesRaw as Paddle[];
const detailKeys = Object.keys(statLabels) as (keyof Paddle)[];

function num(v: string | undefined): number {
  if (!v) return 0;
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

// Paddles with full stats + images
const complete = paddles.filter(p => p.image_url && p.swingweight && p.twistweight && p.spin_rpm && p.power_mph);

// Precompute normalization arrays once
const sws = complete.map(p => num(p.swingweight));
const tws = complete.map(p => num(p.twistweight));
const spins = complete.map(p => num(p.spin_rpm));
const pows = complete.map(p => num(p.power_mph));
const pops = complete.map(p => num(p.pop_mph));
const norm = (v: number, arr: number[]) => {
  const min = Math.min(...arr.filter(x => x > 0));
  const max = Math.max(...arr);
  return max === min ? 0.5 : (v - min) / (max - min);
};

// Top 4 per category
const top4Power = [...complete].sort((a, b) => num(b.power_mph) - num(a.power_mph)).slice(0, 4);
const top4Control = [...complete].sort((a, b) => {
  const scoreA = num(a.twistweight) * 10 - num(a.swingweight);
  const scoreB = num(b.twistweight) * 10 - num(b.swingweight);
  return scoreB - scoreA;
}).slice(0, 4);
const top4Spin = [...complete].sort((a, b) => num(b.spin_rpm) - num(a.spin_rpm)).slice(0, 4);
const top4AllRound = [...complete].sort((a, b) => {
  const scoreA = norm(num(a.twistweight), tws) + norm(num(a.spin_rpm), spins) + norm(num(a.power_mph), pows) + norm(num(a.pop_mph), pops);
  const scoreB = norm(num(b.twistweight), tws) + norm(num(b.spin_rpm), spins) + norm(num(b.power_mph), pows) + norm(num(b.pop_mph), pops);
  return scoreB - scoreA;
}).slice(0, 4);

const categories = [
  { label: "🔥 Most Powerful", subtitle: "Highest power output (MPH)", paddles: top4Power, accent: "border-[#E8845C]", badge: "bg-[#E8845C]/10 text-[#E8845C]" },
  { label: "🎯 Best Control", subtitle: "High twist weight + low swing weight", paddles: top4Control, accent: "border-[#A8D4E6]", badge: "bg-[#A8D4E6]/30 text-[#1A4D2E]" },
  { label: "🌀 Most Spin", subtitle: "Highest spin RPM", paddles: top4Spin, accent: "border-[#F2B63C]", badge: "bg-[#F2B63C]/20 text-[#1A4D2E]" },
  { label: "⭐ Best All-Rounder", subtitle: "Top balanced across all stats", paddles: top4AllRound, accent: "border-[#1A4D2E]", badge: "bg-[#1A4D2E]/10 text-[#1A4D2E]" },
];

export default function Home() {
  const [selected, setSelected] = useState<Paddle | null>(null);

  return (
    <div>
      {/* Bento Grid Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px] md:auto-rows-[240px]">
          {/* Large Hero Card */}
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
                <Link href="/quiz" className="inline-flex items-center gap-2 bg-[#1A4D2E] text-white font-semibold px-7 py-3 rounded-full hover:bg-[#153D24] transition-colors shadow-warm">
                  Take the Quiz ✦
                </Link>
                <Link href="/search" className="inline-flex items-center gap-2 bg-white/60 text-[#1A1A1A] font-semibold px-7 py-3 rounded-full hover:bg-white/80 transition-colors">
                  Browse All →
                </Link>
              </div>
            </div>
            <div className="absolute bottom-4 right-6 text-8xl opacity-20 select-none">🥒</div>
          </div>

          {/* Quiz Card */}
          <Link href="/quiz" className="group bg-[#A8D4E6] rounded-3xl p-7 flex flex-col justify-between hover:shadow-warm-lg transition-all duration-300">
            <div>
              <span className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-wide">✧ Interactive</span>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A] mt-2 leading-tight">QUIZ</h2>
              <p className="text-[#1A1A1A]/60 text-sm mt-2">7 quick questions to find your perfect match</p>
            </div>
            <div className="text-[#1A4D2E] font-semibold text-sm group-hover:translate-x-1 transition-transform">Start Quiz →</div>
          </Link>

          {/* Compare Card */}
          <Link href="/compare" className="group bg-[#E8845C] rounded-3xl p-7 flex flex-col justify-between hover:shadow-warm-lg transition-all duration-300">
            <div>
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">✧ Side by Side</span>
              <h2 className="font-display text-2xl font-bold text-white mt-2 leading-tight">COMPARE</h2>
              <p className="text-white/70 text-sm mt-2">Put up to 5 paddles head-to-head</p>
            </div>
            <div className="text-white font-semibold text-sm group-hover:translate-x-1 transition-transform">Compare Now →</div>
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

      {/* Best in Category */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 bg-[#1A4D2E] text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            ✦ Rankings
          </span>
          <h2 className="font-display text-3xl font-bold text-[#1A1A1A]">Best in Category</h2>
          <p className="text-[#6B6B6B] mt-2">Top 4 performers in each category, ranked by the numbers</p>
        </div>

        <div className="space-y-12">
          {categories.map((cat) => (
            <div key={cat.label}>
              <div className="flex items-center gap-3 mb-5">
                <span className={`inline-block text-sm font-bold px-4 py-1.5 rounded-full ${cat.badge}`}>
                  {cat.label}
                </span>
                <span className="text-sm text-[#6B6B6B]">{cat.subtitle}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cat.paddles.map((p, i) => (
                  <PaddleCard key={`${p.brand}-${p.paddle_name}-${i}`} paddle={p} onClick={() => setSelected(p)} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/search" className="inline-flex items-center gap-2 bg-[#1A4D2E] text-white font-semibold px-7 py-3 rounded-full hover:bg-[#153D24] transition-colors">
            View All 437 Paddles →
          </Link>
        </div>
      </section>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-[#FFFDF9] rounded-3xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-wide">{selected.brand}</div>
                  <h2 className="text-xl font-bold">{selected.paddle_name}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="text-[#6B6B6B] hover:text-[#1A1A1A] text-xl">✕</button>
              </div>
              <PaddleImage src={selected.image_url} alt={`${selected.brand} ${selected.paddle_name}`} height={200} />
            </div>
            <div className="space-y-2">
              {detailKeys.map(key => {
                const val = selected[key];
                if (!val || val === "") return null;
                return (
                  <div key={key} className="flex justify-between py-2 border-b border-[#1A4D2E]/5">
                    <span className="text-sm text-[#6B6B6B]">
                      {getStatTooltip(key) ? (
                        <Tooltip text={getStatTooltip(key)!}>{statLabels[key]}</Tooltip>
                      ) : statLabels[key]}
                    </span>
                    <span className="text-sm font-medium">
                      {key === "build_style" && getBuildStyleTooltip(val) ? (
                        <Tooltip text={getBuildStyleTooltip(val)!}>{formatStat(key, val)}</Tooltip>
                      ) : formatStat(key, val)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
