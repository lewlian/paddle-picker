"use client";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import paddlesRaw from "@/data/paddles.json";
import { Paddle, num, formatStat, statLabels } from "@/types/paddle";
import PaddleCard, { PaddleImage } from "@/components/PaddleCard";
import Tooltip, { getStatTooltip, getBuildStyleTooltip } from "@/components/Tooltip";

const paddles = paddlesRaw as Paddle[];

function unique(arr: string[]): string[] {
  return [...new Set(arr.map(s => s.trim()).filter(Boolean))].sort();
}

const brands = unique(paddles.map(p => p.brand));
const shapes = unique(paddles.map(p => p.shape));
const buildStyles = unique(paddles.map(p => p.build_style));
const paddleTypes = unique(paddles.map(p => p.paddle_type));
const thicknesses = unique(paddles.map(p => p.core_thickness_mm));

type SortKey = "year_released" | "paddle_name" | "brand" | "swingweight" | "twistweight" | "weight_oz" | "spin_rpm" | "power_mph" | "pop_mph" | "core_thickness_mm";
const sortOptions: { key: SortKey; label: string }[] = [
  { key: "year_released", label: "Year" },
  { key: "paddle_name", label: "Name" },
  { key: "brand", label: "Brand" },
  { key: "swingweight", label: "Swingweight" },
  { key: "twistweight", label: "Twistweight" },
  { key: "weight_oz", label: "Weight" },
  { key: "spin_rpm", label: "Spin RPM" },
  { key: "power_mph", label: "Power" },
  { key: "core_thickness_mm", label: "Core Thickness" },
];

const detailKeys = Object.keys(statLabels) as (keyof Paddle)[];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [shape, setShape] = useState("");
  const [buildStyle, setBuildStyle] = useState("");
  const [paddleType, setPaddleType] = useState("");
  const [thickness, setThickness] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("year_released");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Paddle | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  const addToCompare = useCallback((p: Paddle) => {
    try {
      const existing = JSON.parse(localStorage.getItem("comparePaddles") || "[]") as string[];
      const key = `${p.brand}|||${p.paddle_name}`;
      if (!existing.includes(key) && existing.length < 5) {
        existing.push(key);
        localStorage.setItem("comparePaddles", JSON.stringify(existing));
      }
      router.push("/compare");
    } catch {
      router.push("/compare");
    }
  }, [router]);

  const filtered = useMemo(() => {
    let result = paddles.filter(p => {
      const q = query.toLowerCase();
      const matchesQuery = !q || p.paddle_name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      const matchesBrand = !brand || p.brand === brand;
      const matchesShape = !shape || p.shape.trim() === shape;
      const matchesBuild = !buildStyle || p.build_style === buildStyle;
      const matchesType = !paddleType || p.paddle_type === paddleType;
      const matchesThick = !thickness || p.core_thickness_mm === thickness;
      return matchesQuery && matchesBrand && matchesShape && matchesBuild && matchesType && matchesThick;
    });

    result.sort((a, b) => {
      const isText = sortBy === "paddle_name" || sortBy === "brand";
      const av = isText ? a[sortBy] : num(a[sortBy]);
      const bv = isText ? b[sortBy] : num(b[sortBy]);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [query, brand, shape, buildStyle, paddleType, thickness, sortBy, sortDir]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2">🔍 Paddle Encyclopedia</h1>
        <p className="text-[#6B6B6B]">Search and filter through {paddles.length} paddles</p>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name or brand..."
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

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6 animate-fade-in">
          <Select label="Brand" value={brand} onChange={setBrand} options={brands} />
          <Select label="Shape" value={shape} onChange={setShape} options={shapes} />
          <Select label="Build Style" value={buildStyle} onChange={setBuildStyle} options={buildStyles} />
          <Select label="Paddle Type" value={paddleType} onChange={setPaddleType} options={paddleTypes} />
          <Select label="Core Thickness" value={thickness} onChange={setThickness} options={thicknesses} />
        </div>
      )}

      {/* Sort */}
      <div className="flex items-center gap-3 mb-6 text-sm">
        <span className="text-[#6B6B6B]">Sort by:</span>
        <div className="flex flex-wrap gap-1.5">
          {sortOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => {
                if (sortBy === opt.key) setSortDir(d => d === "asc" ? "desc" : "asc");
                else { setSortBy(opt.key); setSortDir("asc"); }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                sortBy === opt.key
                  ? "bg-[#1A4D2E] text-white"
                  : "bg-[#1A1A1A]/5 text-[#6B6B6B] hover:bg-[#1A4D2E]/10"
              }`}
            >
              {opt.label} {sortBy === opt.key && (sortDir === "asc" ? "↑" : "↓")}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-[#6B6B6B] mb-4">{filtered.length} paddles found</div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.slice(0, 60).map((p, i) => (
          <PaddleCard key={`${p.brand}-${p.paddle_name}-${i}`} paddle={p} onClick={() => setSelected(p)} />
        ))}
      </div>
      {filtered.length > 60 && (
        <p className="text-center text-[#6B6B6B] text-sm mt-6">Showing 60 of {filtered.length} — narrow your search to see more</p>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div
            className="bg-[#FFFDF9] rounded-3xl shadow-warm-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-wide">{selected.brand}</div>
                  <h2 className="font-display text-xl font-bold">{selected.paddle_name}</h2>
                </div>
                <button onClick={() => setSelected(null)} className="text-[#6B6B6B] hover:text-[#1A1A1A] text-xl">✕</button>
              </div>
              <PaddleImage src={selected.image_url} alt={`${selected.brand} ${selected.paddle_name}`} height={200} />
              <button
                onClick={() => addToCompare(selected)}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-[#1A4D2E] text-white font-semibold px-4 py-2.5 rounded-full hover:bg-[#153D24] transition-colors text-sm"
              >
                ⚖️ Add to Compare
              </button>
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
