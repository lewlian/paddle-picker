"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import paddlesRaw from "@/data/paddles.json";
import { Paddle, num, formatStat, statLabels } from "@/types/paddle";
import { PaddleImage } from "@/components/PaddleCard";

const paddles = paddlesRaw as Paddle[];

const compareStats: (keyof Paddle)[] = [
  "shape", "face_material", "grit_type", "build_style", "paddle_type",
  "core_thickness_mm", "grip_length_in", "grip_size_in", "weight_oz",
  "swingweight", "twistweight", "balance_point_mm",
  "spin_rating", "spin_rpm", "power_mph", "pop_mph",
  "year_released", "approval_body",
];

const numericStats = new Set(["core_thickness_mm", "grip_length_in", "grip_size_in", "weight_oz", "swingweight", "twistweight", "balance_point_mm", "spin_rpm", "power_mph", "pop_mph"]);
const higherBetter = new Set(["twistweight", "spin_rpm", "power_mph", "pop_mph"]);
const lowerBetter = new Set(["swingweight"]); // debatable, but lower is often more maneuverable

export default function ComparePage() {
  const [selected, setSelected] = useState<Paddle[]>([]);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!search) return [];
    const q = search.toLowerCase();
    return paddles
      .filter(p => p.paddle_name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
      .filter(p => !selected.some(s => s.brand === p.brand && s.paddle_name === p.paddle_name))
      .slice(0, 8);
  }, [search, selected]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const addPaddle = (p: Paddle) => {
    if (selected.length < 5) {
      setSelected([...selected, p]);
      setSearch("");
      setShowDropdown(false);
    }
  };

  const removePaddle = (idx: number) => {
    setSelected(selected.filter((_, i) => i !== idx));
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
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">⚖️ Compare Paddles</h1>
        <p className="text-gray-500">Select up to 5 paddles to compare side-by-side</p>
      </div>

      {/* Add Paddle Search */}
      <div className="relative max-w-md mb-8">
        <input
          ref={inputRef}
          type="text"
          placeholder={selected.length >= 5 ? "Max 5 paddles reached" : "Search to add a paddle..."}
          value={search}
          onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          disabled={selected.length >= 5}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-lime-400 focus:ring-2 focus:ring-lime-100 outline-none text-sm disabled:opacity-50"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        {showDropdown && results.length > 0 && (
          <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-10 max-h-64 overflow-y-auto">
            {results.map((p, i) => (
              <button
                key={`${p.brand}-${p.paddle_name}-${i}`}
                onClick={() => addPaddle(p)}
                className="w-full text-left px-4 py-3 hover:bg-lime-50 transition-colors border-b border-gray-50 last:border-0"
              >
                <span className="text-xs text-lime-600 font-medium">{p.brand}</span>
                <span className="ml-2 text-sm text-gray-900">{p.paddle_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Paddles Header */}
      {selected.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚖️</div>
          <p className="text-gray-400 text-lg">Search and add paddles to start comparing</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Paddle Headers */}
          <div className="flex gap-4 mb-6 min-w-fit">
            <div className="w-36 shrink-0" />
            {selected.map((p, idx) => (
              <div key={idx} className="w-44 shrink-0 text-center">
                <div className="bg-gradient-to-br from-lime-50 to-green-50 rounded-xl border border-lime-200 relative overflow-hidden">
                  <button
                    onClick={() => removePaddle(idx)}
                    className="absolute top-1 right-1 z-10 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                  >
                    ✕
                  </button>
                  <PaddleImage src={p.image_url} alt={`${p.brand} ${p.paddle_name}`} height={120} />
                  <div className="p-3">
                    <div className="text-xs font-medium text-lime-600 uppercase">{p.brand}</div>
                    <div className="text-sm font-bold text-gray-900 mt-1 leading-tight">{p.paddle_name}</div>
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
                <div key={key} className="flex gap-4 items-center py-2.5 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <div className="w-36 shrink-0 text-sm text-gray-500 font-medium">{statLabels[key]}</div>
                  {selected.map((p, idx) => {
                    const val = p[key];
                    const isBest = bw?.bestIdx === idx;
                    const isWorst = bw?.worstIdx === idx;
                    return (
                      <div
                        key={idx}
                        className={`w-44 shrink-0 text-center text-sm font-medium rounded-lg py-1 ${
                          isBest ? "bg-lime-100 text-lime-700" : isWorst ? "bg-red-50 text-red-500" : "text-gray-700"
                        }`}
                      >
                        {formatStat(key, val || "")}
                        {isBest && " ✓"}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
