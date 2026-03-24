"use client";
import { useState, useMemo, useEffect } from "react";
import paddlesRaw from "@/data/paddles.json";
import { Paddle, num, formatStat, statLabels } from "@/types/paddle";
import { PaddleImage } from "@/components/PaddleCard";
import Tooltip, { getStatTooltip, getBuildStyleTooltip } from "@/components/Tooltip";

const paddles = paddlesRaw as Paddle[];

function unique(arr: string[]): string[] {
  return [...new Set(arr.map(s => s.trim()).filter(Boolean))].sort();
}

const brands = unique(paddles.map(p => p.brand));
const shapes = unique(paddles.map(p => p.shape));
const buildStyles = unique(paddles.map(p => p.build_style));
const paddleTypes = unique(paddles.map(p => p.paddle_type));

const compareStats: (keyof Paddle)[] = [
  "shape", "face_material", "grit_type", "build_style", "paddle_type",
  "core_thickness_mm", "grip_length_in", "grip_size_in", "weight_oz",
  "swingweight", "twistweight", "balance_point_mm",
  "spin_rating", "spin_rpm", "power_mph", "pop_mph",
  "year_released", "approval_body",
];

const numericStats = new Set(["core_thickness_mm", "grip_length_in", "grip_size_in", "weight_oz", "swingweight", "twistweight", "balance_point_mm", "spin_rpm", "power_mph", "pop_mph"]);
const higherBetter = new Set(["twistweight", "spin_rpm", "power_mph", "pop_mph"]);
const lowerBetter = new Set(["swingweight"]);

function paddleKey(p: Paddle) {
  return `${p.brand}|||${p.paddle_name}`;
}

export default function ComparePage() {
  const [selected, setSelected] = useState<Paddle[]>([]);
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [shape, setShape] = useState("");
  const [buildStyle, setBuildStyle] = useState("");
  const [paddleType, setPaddleType] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Load from localStorage on mount (from search page "Add to Compare")
  useEffect(() => {
    try {
      const stored = localStorage.getItem("comparePaddles");
      if (stored) {
        const keys: string[] = JSON.parse(stored);
        const found = keys.map(k => paddles.find(p => paddleKey(p) === k)).filter(Boolean) as Paddle[];
        if (found.length > 0) {
          setSelected(found.slice(0, 5));
        }
        localStorage.removeItem("comparePaddles");
      }
    } catch {}
  }, []);

  const selectedKeys = useMemo(() => new Set(selected.map(paddleKey)), [selected]);

  const filtered = useMemo(() => {
    return paddles.filter(p => {
      const q = query.toLowerCase();
      const matchesQuery = !q || p.paddle_name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      const matchesBrand = !brand || p.brand === brand;
      const matchesShape = !shape || p.shape.trim() === shape;
      const matchesBuild = !buildStyle || p.build_style === buildStyle;
      const matchesType = !paddleType || p.paddle_type === paddleType;
      return matchesQuery && matchesBrand && matchesShape && matchesBuild && matchesType;
    });
  }, [query, brand, shape, buildStyle, paddleType]);

  const togglePaddle = (p: Paddle) => {
    const key = paddleKey(p);
    if (selectedKeys.has(key)) {
      setSelected(selected.filter(s => paddleKey(s) !== key));
    } else if (selected.length < 5) {
      setSelected([...selected, p]);
    }
  };

  function getBestWorst(key: keyof Paddle): { bestIdx: number; worstIdx: number } | null {
    if (!numericStats.has(key) || selected.length < 2) return null;
    const vals = selected.map(p => num(p[key] ?? ""));
    if (vals.every(v => v === 0)) return null;
    const nonZero = vals.filter(v => v > 0);
    if (nonZero.length < 2) return null;
    const max = Math.max(...vals.filter(v => v > 0));
    const min = Math.min(...vals.filter(v => v > 0));
    if (max === min) return null;
    const maxIdx = vals.indexOf(max);
    const minIdx = vals.indexOf(min);
    if (higherBetter.has(key)) return { bestIdx: maxIdx, worstIdx: minIdx };
    if (lowerBetter.has(key)) return { bestIdx: minIdx, worstIdx: maxIdx };
    return { bestIdx: maxIdx, worstIdx: minIdx };
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold mb-2">⚖️ Compare Paddles</h1>
        <p className="text-[#6B6B6B]">Select up to 5 paddles to compare side-by-side</p>
      </div>

      {/* Selected pills */}
      {selected.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-[#6B6B6B]">Comparing ({selected.length}/5):</span>
            {selected.map((p, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 bg-[#1A4D2E]/10 text-[#1A4D2E] text-xs font-medium px-3 py-1.5 rounded-full"
              >
                {p.brand} {p.paddle_name}
                <button
                  onClick={() => setSelected(selected.filter((_, i) => i !== idx))}
                  className="text-[#1A4D2E]/60 hover:text-[#DC6B4A] transition-colors ml-0.5"
                >
                  ✕
                </button>
              </span>
            ))}
            {selected.length >= 2 && (
              <a
                href="#comparison"
                className="inline-flex items-center gap-1 bg-[#1A4D2E] text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-[#153D24] transition-colors ml-2"
              >
                View Comparison ↓
              </a>
            )}
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search paddles by name or brand..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full border border-[#1A4D2E]/10 bg-[#FFFDF9] focus:border-[#1A4D2E]/30 focus:ring-2 focus:ring-[#1A4D2E]/10 outline-none transition-all text-sm"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B]">🔍</span>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-5 py-3 rounded-full border text-sm font-medium transition-all ${
            showFilters ? "bg-[#1A4D2E] text-white border-[#1A4D2E]" : "border-[#1A4D2E]/10 text-[#6B6B6B] hover:border-[#1A4D2E]/30 bg-[#FFFDF9]"
          }`}
        >
          ⚙️ Filters
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 animate-fade-in">
          <Select label="Brand" value={brand} onChange={setBrand} options={brands} />
          <Select label="Shape" value={shape} onChange={setShape} options={shapes} />
          <Select label="Build Style" value={buildStyle} onChange={setBuildStyle} options={buildStyles} />
          <Select label="Paddle Type" value={paddleType} onChange={setPaddleType} options={paddleTypes} />
        </div>
      )}

      <div className="text-sm text-[#6B6B6B] mb-4">{filtered.length} paddles</div>

      {/* Paddle Grid with Checkmarks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-12">
        {filtered.slice(0, 80).map((p, i) => {
          const isSelected = selectedKeys.has(paddleKey(p));
          const isDisabled = !isSelected && selected.length >= 5;
          return (
            <button
              key={`${p.brand}-${p.paddle_name}-${i}`}
              onClick={() => !isDisabled && togglePaddle(p)}
              disabled={isDisabled}
              className={`relative group text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 ${
                isSelected
                  ? "border-[#1A4D2E] bg-[#1A4D2E]/5 shadow-warm ring-2 ring-[#1A4D2E]/20"
                  : isDisabled
                  ? "border-[#1A4D2E]/5 opacity-50 cursor-not-allowed"
                  : "border-[#1A4D2E]/5 hover:border-[#1A4D2E]/20 hover:shadow-warm"
              }`}
            >
              {/* Checkmark badge */}
              <div
                className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                  isSelected
                    ? "bg-[#1A4D2E] text-white shadow"
                    : "bg-white/80 border border-[#1A4D2E]/10 text-transparent group-hover:border-[#1A4D2E]/30"
                }`}
              >
                ✓
              </div>

              <div className="bg-[#FAF6F0] flex items-center justify-center" style={{ height: 120 }}>
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={`${p.brand} ${p.paddle_name}`}
                    className="h-full w-full object-contain p-2"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden"); }}
                  />
                ) : null}
                <div className={`text-3xl ${p.image_url ? "hidden" : ""}`}>🥒</div>
              </div>
              <div className="p-3 bg-[#FFFDF9]">
                <div className="text-[10px] font-semibold text-[#1A4D2E] uppercase tracking-wide">{p.brand}</div>
                <div className="text-xs font-bold text-[#1A1A1A] mt-0.5 leading-tight line-clamp-2">{p.paddle_name}</div>
                <div className="flex gap-2 mt-2 text-[10px] text-[#6B6B6B]">
                  {p.swingweight && <span>SW: {p.swingweight}</span>}
                  {p.twistweight && <span>TW: {p.twistweight}</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {filtered.length > 80 && (
        <p className="text-center text-[#6B6B6B] text-sm mb-12">Showing 80 of {filtered.length} — use search/filters to narrow down</p>
      )}

      {/* Comparison Table */}
      {selected.length >= 2 && (
        <div id="comparison" className="scroll-mt-20">
          <div className="border-t-2 border-[#1A4D2E]/20 pt-8 mb-6">
            <h2 className="font-display text-2xl font-bold mb-2">📊 Side-by-Side Comparison</h2>
            <p className="text-[#6B6B6B] text-sm">Comparing {selected.length} paddles — green is best, coral is lowest</p>
          </div>

          <div className="overflow-x-auto">
            {/* Paddle Headers */}
            <div className="flex gap-4 mb-6 min-w-fit">
              <div className="w-36 shrink-0" />
              {selected.map((p, idx) => (
                <div key={idx} className="w-44 shrink-0 text-center">
                  <div className="bg-[#FFFDF9] rounded-2xl border border-[#1A4D2E]/10 relative overflow-hidden shadow-warm">
                    <button
                      onClick={() => setSelected(selected.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 z-10 w-6 h-6 bg-[#DC6B4A] text-white rounded-full text-xs flex items-center justify-center hover:bg-[#c55a3a] transition-colors shadow"
                    >
                      ✕
                    </button>
                    <PaddleImage src={p.image_url} alt={`${p.brand} ${p.paddle_name}`} height={120} />
                    <div className="p-3">
                      <div className="text-xs font-semibold text-[#1A4D2E] uppercase">{p.brand}</div>
                      <div className="text-sm font-bold text-[#1A1A1A] mt-1 leading-tight">{p.paddle_name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Rows */}
            <div className="space-y-0 min-w-fit">
              {compareStats.map(key => {
                const bw = getBestWorst(key);
                return (
                  <div key={key} className="flex gap-4 items-center py-2.5 border-b border-[#1A4D2E]/5 hover:bg-[#1A4D2E]/[0.02] transition-colors">
                    <div className="w-36 shrink-0 text-sm text-[#6B6B6B] font-medium">
                      {getStatTooltip(key) ? (
                        <Tooltip text={getStatTooltip(key)!}>{statLabels[key]}</Tooltip>
                      ) : statLabels[key]}
                    </div>
                    {selected.map((p, idx) => {
                      const val = p[key];
                      const isBest = bw?.bestIdx === idx;
                      const isWorst = bw?.worstIdx === idx;
                      return (
                        <div
                          key={idx}
                          className={`w-44 shrink-0 text-center text-sm font-medium rounded-lg py-1 ${
                            isBest ? "bg-[#1A4D2E]/10 text-[#1A4D2E]" : isWorst ? "bg-[#DC6B4A]/10 text-[#DC6B4A]" : "text-[#1A1A1A]"
                          }`}
                        >
                          {key === "build_style" && val && getBuildStyleTooltip(val) ? (
                          <Tooltip text={getBuildStyleTooltip(val)!}>{formatStat(key, val)}</Tooltip>
                        ) : formatStat(key, val || "")}
                          {isBest && " ✓"}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selected.length === 1 && (
        <div id="comparison" className="scroll-mt-20 text-center py-12 border-t-2 border-dashed border-[#1A4D2E]/10">
          <p className="text-[#6B6B6B] text-lg">Select at least 1 more paddle to see the comparison</p>
        </div>
      )}
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-full border border-[#1A4D2E]/10 text-sm text-[#1A1A1A] focus:border-[#1A4D2E]/30 focus:ring-2 focus:ring-[#1A4D2E]/10 outline-none bg-[#FFFDF9]"
    >
      <option value="">{label} (All)</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
