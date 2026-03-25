"use client";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import paddlesRaw from "@/data/paddles.json";
import { Paddle, num } from "@/types/paddle";
import PaddleCard, { PaddleImage } from "@/components/PaddleCard";

const paddles = paddlesRaw as Paddle[];

// ─── Types ────────────────────────────────────────────────────────────────────

type Route = "A" | "B" | null;

interface RouteAAnswers {
  currentPaddle: Paddle | null;
  customBrand: string;
  customModel: string;
  likes: string[];
  improvements: string[];
  playStyle: string;
  skillLevel: string;
  goal: string;
}

interface RouteBAnswers {
  skillLevel: string;
  playStyle: string;
  gameStyle: string;
  priorities: string[];
  shape: string;
  gripSize: string;
  coreThickness: string;
}

interface ScoredPaddle {
  paddle: Paddle;
  score: number;
  reason: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LIKES_OPTIONS = [
  { label: "Great power", value: "power", emoji: "💥" },
  { label: "Good control/touch", value: "control", emoji: "🎯" },
  { label: "Nice spin", value: "spin", emoji: "🌀" },
  { label: "Comfortable grip", value: "grip", emoji: "✋" },
  { label: "Good sweet spot", value: "sweetspot", emoji: "🎯" },
  { label: "Light and maneuverable", value: "light", emoji: "🪶" },
  { label: "Solid feel", value: "solid", emoji: "🪨" },
];

const IMPROVEMENTS_OPTIONS = [
  { label: "More power", value: "more_power", emoji: "💪" },
  { label: "More control", value: "more_control", emoji: "🎯" },
  { label: "More spin", value: "more_spin", emoji: "🌀" },
  { label: "Better sweet spot/forgiveness", value: "better_sweetspot", emoji: "🛡️" },
  { label: "Lighter weight", value: "lighter", emoji: "🪶" },
  { label: "Heavier/more stable", value: "heavier", emoji: "⚖️" },
  { label: "Different shape", value: "different_shape", emoji: "📐" },
  { label: "Better pop at the net", value: "better_pop", emoji: "⚡" },
];

const PLAY_STYLE_OPTIONS = [
  { label: "Singles focused", value: "singles", emoji: "1️⃣" },
  { label: "Doubles focused", value: "doubles", emoji: "2️⃣" },
  { label: "Both equally", value: "both", emoji: "🤝" },
];

const SKILL_OPTIONS = [
  { label: "Beginner", value: "beginner", emoji: "🌱" },
  { label: "Intermediate", value: "intermediate", emoji: "📈" },
  { label: "Advanced", value: "advanced", emoji: "⚡" },
  { label: "Pro", value: "pro", emoji: "🏆" },
];

const GOAL_OPTIONS = [
  { label: "A replacement (similar but better)", value: "replacement", emoji: "🔄" },
  { label: "A complement (different strengths)", value: "complement", emoji: "🔀" },
  { label: "Just exploring options", value: "exploring", emoji: "🔍" },
];

const GAME_STYLE_OPTIONS = [
  { label: "Aggressive", value: "aggressive", emoji: "💥", desc: "Big drives & put-aways" },
  { label: "All-Court", value: "allcourt", emoji: "⚖️", desc: "Balanced game" },
  { label: "Defensive", value: "defensive", emoji: "🛡️", desc: "Soft game, dinks, resets" },
];

const PRIORITY_OPTIONS = [
  { label: "Power", value: "power", emoji: "💪" },
  { label: "Spin", value: "spin", emoji: "🌀" },
  { label: "Control/Touch", value: "control", emoji: "🎯" },
  { label: "Forgiveness", value: "forgiveness", emoji: "🛡️" },
  { label: "Speed/Maneuverability", value: "speed", emoji: "⚡" },
];

const SHAPE_OPTIONS = [
  { label: "Elongated", value: "elongated", emoji: "📏", desc: "More reach" },
  { label: "Hybrid", value: "hybrid", emoji: "🔀", desc: "Balanced" },
  { label: "Widebody", value: "widebody", emoji: "🟩", desc: "Biggest sweet spot" },
  { label: "Not sure", value: "any", emoji: "🤷", desc: "Let us decide" },
];

const GRIP_OPTIONS = [
  { label: "Small (4\")", value: "4", emoji: "🤏" },
  { label: "Medium (4.125\")", value: "4.125", emoji: "✋" },
  { label: "Large (4.25\")", value: "4.25", emoji: "🖐️" },
  { label: "Not sure", value: "any", emoji: "🤷" },
];

const CORE_OPTIONS = [
  { label: "Thin (14mm)", value: "thin", emoji: "⚡", desc: "Fast hands" },
  { label: "Standard (16mm)", value: "standard", emoji: "⚖️", desc: "Balanced" },
  { label: "Thick (16mm+)", value: "thick", emoji: "💪", desc: "More power" },
  { label: "Not sure", value: "any", emoji: "🤷", desc: "Let us decide" },
];

const resultCardColors = [
  "bg-[#F2B63C]/20",
  "bg-[#A8D4E6]/20",
  "bg-[#E8845C]/20",
  "bg-[#F2B63C]/10",
  "bg-[#A8D4E6]/10",
];

// ─── Searchable Paddle Dropdown ───────────────────────────────────────────────

function PaddleSearch({
  onSelect,
  selected,
}: {
  onSelect: (p: Paddle | null) => void;
  selected: Paddle | null;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return paddles.slice(0, 20);
    const q = query.toLowerCase();
    return paddles
      .filter(
        (p) =>
          p.brand.toLowerCase().includes(q) ||
          p.paddle_name.toLowerCase().includes(q) ||
          `${p.brand} ${p.paddle_name}`.toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (selected) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl border-2 border-[#1A4D2E] bg-[#1A4D2E]/5">
        <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-[#FAF6F0]">
          <PaddleImage
            src={selected.image_url}
            alt={`${selected.brand} ${selected.paddle_name}`}
            height={64}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-[#1A4D2E] uppercase">
            {selected.brand}
          </div>
          <div className="font-bold text-[#1A1A1A] truncate">
            {selected.paddle_name}
          </div>
        </div>
        <button
          onClick={() => {
            onSelect(null);
            setQuery("");
          }}
          className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A] px-2"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search by brand or paddle name..."
        className="w-full p-4 rounded-2xl border-2 border-[#1A4D2E]/10 bg-[#FFFDF9] text-[#1A1A1A] placeholder:text-[#6B6B6B]/50 focus:border-[#1A4D2E] focus:outline-none transition-colors"
      />
      {open && (
        <div className="absolute z-50 mt-2 w-full max-h-72 overflow-y-auto rounded-2xl border border-[#1A4D2E]/10 bg-[#FFFDF9] shadow-lg">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-[#6B6B6B] text-sm">
              No paddles found — you can enter your paddle manually below
            </div>
          ) : (
            filtered.map((p, i) => (
              <button
                key={`${p.brand}-${p.paddle_name}-${i}`}
                onClick={() => {
                  onSelect(p);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-[#1A4D2E]/5 transition-colors text-left border-b border-[#1A4D2E]/5 last:border-0"
              >
                <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-[#FAF6F0]">
                  <PaddleImage
                    src={p.image_url}
                    alt={`${p.brand} ${p.paddle_name}`}
                    height={40}
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-[#1A4D2E] uppercase">
                    {p.brand}
                  </div>
                  <div className="text-sm font-medium text-[#1A1A1A] truncate">
                    {p.paddle_name}
                  </div>
                </div>
                <div className="ml-auto text-[10px] text-[#6B6B6B]">
                  {p.year_released}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Recommendation Engine ────────────────────────────────────────────────────

function normalizeStats(paddleList: Paddle[]) {
  const stats = [
    "swingweight",
    "twistweight",
    "spin_rpm",
    "power_mph",
    "pop_mph",
    "weight_oz",
  ] as const;
  const mins: Record<string, number> = {};
  const maxs: Record<string, number> = {};

  for (const s of stats) {
    let min = Infinity,
      max = -Infinity;
    for (const p of paddleList) {
      const v = num(p[s]);
      if (v > 0) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    mins[s] = min === Infinity ? 0 : min;
    maxs[s] = max === -Infinity ? 1 : max;
  }

  return (p: Paddle, stat: string): number => {
    const v = num(p[stat as keyof Paddle] as string);
    if (v <= 0) return 0.5;
    const range = maxs[stat] - mins[stat];
    if (range === 0) return 0.5;
    return (v - mins[stat]) / range;
  };
}

function recencyBonus(p: Paddle): number {
  const y = p.year_released?.trim();
  if (y === "2026") return 30;
  if (y === "2025") return 15;
  if (y === "2024") return 5;
  return 0;
}

function popularityBonus(p: Paddle): number {
  return parseFloat((p as Paddle & { popularity_score?: string }).popularity_score || "0") * 0.5;
}

function missingStatsPenalty(p: Paddle): number {
  const sw = num(p.swingweight);
  const tw = num(p.twistweight);
  if (sw <= 0 || tw <= 0) return -20;
  return 0;
}

function shapeMatch(p: Paddle, pref: string): boolean {
  if (pref === "any") return true;
  const s = p.shape.trim().toLowerCase();
  return s.includes(pref);
}

function scoreRouteA(
  p: Paddle,
  answers: RouteAAnswers,
  norm: ReturnType<typeof normalizeStats>
): ScoredPaddle {
  let score = 0;
  const reasons: string[] = [];
  const current = answers.currentPaddle;

  // Don't recommend the same paddle
  if (
    current &&
    p.brand === current.brand &&
    p.paddle_name === current.paddle_name
  ) {
    return { paddle: p, score: -1000, reason: "" };
  }

  const isReplacement = answers.goal === "replacement";
  const isComplement = answers.goal === "complement";

  // Improvement-based scoring
  for (const imp of answers.improvements) {
    switch (imp) {
      case "more_power": {
        const pwrScore = norm(p, "power_mph") * 15 + norm(p, "swingweight") * 10;
        score += pwrScore;
        if (current && num(p.power_mph) > num(current.power_mph)) {
          reasons.push(
            `More power — ${p.power_mph} mph vs your ${current.power_mph} mph`
          );
        }
        break;
      }
      case "more_control": {
        score += norm(p, "twistweight") * 15 + (1 - norm(p, "swingweight")) * 8;
        if (current && num(p.twistweight) > num(current.twistweight)) {
          reasons.push(
            `Better control — TW ${p.twistweight} vs your ${current.twistweight}`
          );
        }
        break;
      }
      case "more_spin": {
        score += norm(p, "spin_rpm") * 20;
        if (current && num(p.spin_rpm) > num(current.spin_rpm)) {
          reasons.push(
            `More spin — ${p.spin_rpm} RPM vs your ${current.spin_rpm} RPM`
          );
        }
        break;
      }
      case "better_sweetspot": {
        score += norm(p, "twistweight") * 18;
        if (num(p.twistweight) > 6.5) reasons.push("Excellent sweet spot & forgiveness");
        break;
      }
      case "better_pop": {
        score += norm(p, "pop_mph") * 18;
        if (current && num(p.pop_mph) > num(current.pop_mph)) {
          reasons.push(
            `Better pop — ${p.pop_mph} mph vs your ${current.pop_mph} mph`
          );
        }
        break;
      }
      case "lighter": {
        score += (1 - norm(p, "weight_oz")) * 15;
        if (current && num(p.weight_oz) < num(current.weight_oz)) {
          reasons.push(
            `Lighter — ${p.weight_oz}oz vs your ${current.weight_oz}oz`
          );
        }
        break;
      }
      case "heavier": {
        score += norm(p, "weight_oz") * 12 + norm(p, "swingweight") * 8;
        if (current && num(p.weight_oz) > num(current.weight_oz)) {
          reasons.push("Heavier & more stable");
        }
        break;
      }
      case "different_shape": {
        if (current && p.shape.trim() !== current.shape.trim()) {
          score += 8;
          reasons.push(`Different shape — ${p.shape.trim()}`);
        }
        break;
      }
    }
  }

  // Likes: don't regress on things they like
  if (current) {
    for (const like of answers.likes) {
      switch (like) {
        case "power":
          if (num(p.power_mph) < num(current.power_mph) * 0.95) score -= 10;
          break;
        case "control":
          if (num(p.twistweight) < num(current.twistweight) * 0.9) score -= 10;
          break;
        case "spin":
          if (num(p.spin_rpm) < num(current.spin_rpm) * 0.9) score -= 10;
          break;
        case "sweetspot":
          if (num(p.twistweight) < num(current.twistweight) * 0.9) score -= 8;
          break;
        case "light":
          if (num(p.weight_oz) > num(current.weight_oz) * 1.05) score -= 8;
          break;
        case "solid":
          if (num(p.swingweight) < num(current.swingweight) * 0.9) score -= 8;
          break;
      }
    }
  }

  // Goal-based adjustments
  if (isReplacement && current) {
    // Similar profile — penalize extreme differences
    const swDiff = Math.abs(num(p.swingweight) - num(current.swingweight));
    const twDiff = Math.abs(num(p.twistweight) - num(current.twistweight));
    if (swDiff > 15) score -= 5;
    if (twDiff > 2) score -= 5;
  } else if (isComplement && current) {
    // Reward difference
    const swDiff = Math.abs(num(p.swingweight) - num(current.swingweight));
    if (swDiff > 8) score += 5;
    if (p.shape.trim() !== current.shape.trim()) score += 3;
    if (p.paddle_type !== current.paddle_type) score += 3;
  }

  // Play style adjustments
  if (answers.playStyle === "singles") {
    if (p.shape.trim().toLowerCase().includes("elongated")) score += 3;
    score += norm(p, "swingweight") * 3;
  } else if (answers.playStyle === "doubles") {
    score += norm(p, "twistweight") * 4;
    score += norm(p, "pop_mph") * 3;
  }

  // Skill level
  if (answers.skillLevel === "beginner") {
    score += norm(p, "twistweight") * 5;
  }

  // Bonuses
  score += recencyBonus(p);
  score += popularityBonus(p);
  score += missingStatsPenalty(p);

  const reason =
    reasons.length > 0
      ? reasons.slice(0, 2).join(" · ")
      : num(p.year_released) >= 2025
      ? `${p.year_released} model — ${p.paddle_type || p.shape.trim()}`
      : `${p.paddle_type || p.shape.trim()} paddle`;

  return { paddle: p, score, reason };
}

function scoreRouteB(
  p: Paddle,
  answers: RouteBAnswers,
  norm: ReturnType<typeof normalizeStats>
): ScoredPaddle {
  let score = 0;
  const reasons: string[] = [];

  // Skill level
  if (answers.skillLevel === "beginner") {
    score += norm(p, "twistweight") * 10;
    if (
      p.shape.trim().toLowerCase().includes("widebody") ||
      p.shape.trim().toLowerCase().includes("hybrid")
    )
      score += 5;
  } else if (
    answers.skillLevel === "advanced" ||
    answers.skillLevel === "pro"
  ) {
    score += 2; // full range allowed
  }

  // Game style
  if (answers.gameStyle === "aggressive") {
    score += norm(p, "power_mph") * 12;
    score += norm(p, "swingweight") * 8;
    if (p.paddle_type === "Power") {
      score += 5;
      reasons.push("Power paddle for aggressive play");
    }
  } else if (answers.gameStyle === "defensive") {
    score += norm(p, "twistweight") * 12;
    score += (1 - norm(p, "swingweight")) * 5;
    if (p.paddle_type === "Control") {
      score += 5;
      reasons.push("Control paddle for soft game");
    }
  } else {
    // allcourt
    score += norm(p, "power_mph") * 5;
    score += norm(p, "twistweight") * 5;
    score += norm(p, "spin_rpm") * 5;
    if (
      p.paddle_type === "All-Court" ||
      p.paddle_type === "All Court"
    ) {
      score += 5;
      reasons.push("All-court paddle for balanced play");
    }
  }

  // Play style (singles/doubles)
  if (answers.playStyle === "singles") {
    if (p.shape.trim().toLowerCase().includes("elongated")) score += 4;
    score += norm(p, "swingweight") * 3;
  } else if (answers.playStyle === "doubles") {
    score += norm(p, "twistweight") * 4;
    score += norm(p, "pop_mph") * 4;
  }

  // Priorities (top 2)
  for (const prio of answers.priorities) {
    switch (prio) {
      case "power":
        score += norm(p, "power_mph") * 10;
        score += norm(p, "swingweight") * 5;
        if (num(p.power_mph) >= 56) reasons.push(`High power — ${p.power_mph} mph`);
        break;
      case "spin":
        score += norm(p, "spin_rpm") * 12;
        if (num(p.spin_rpm) >= 2000)
          reasons.push(`Great spin — ${p.spin_rpm} RPM`);
        break;
      case "control":
        score += norm(p, "twistweight") * 10;
        score += (1 - norm(p, "swingweight")) * 5;
        if (num(p.twistweight) >= 6.5) reasons.push("Excellent control & touch");
        break;
      case "forgiveness":
        score += norm(p, "twistweight") * 12;
        if (
          p.shape.trim().toLowerCase().includes("widebody") ||
          p.shape.trim().toLowerCase().includes("hybrid")
        )
          score += 3;
        if (num(p.twistweight) >= 6.5) reasons.push("Very forgiving");
        break;
      case "speed":
        score += (1 - norm(p, "weight_oz")) * 10;
        score += (1 - norm(p, "swingweight")) * 5;
        if (num(p.weight_oz) < 8) reasons.push("Lightweight & fast");
        break;
    }
  }

  // Shape preference filter
  if (answers.shape !== "any") {
    if (shapeMatch(p, answers.shape)) {
      score += 6;
    } else {
      score -= 8;
    }
  }

  // Grip preference
  if (answers.gripSize !== "any") {
    if (p.grip_size_in === answers.gripSize) score += 4;
    else score -= 3;
  }

  // Core thickness preference
  if (answers.coreThickness !== "any") {
    const ct = num(p.core_thickness_mm);
    if (answers.coreThickness === "thin" && ct > 0 && ct <= 14) score += 4;
    else if (answers.coreThickness === "standard" && ct >= 15 && ct <= 16) score += 4;
    else if (answers.coreThickness === "thick" && ct > 16) score += 4;
    else if (ct > 0) score -= 2;
  }

  // Bonuses
  score += recencyBonus(p);
  score += popularityBonus(p);
  score += missingStatsPenalty(p);

  const reason =
    reasons.length > 0
      ? reasons.slice(0, 2).join(" · ")
      : num(p.year_released) >= 2025
      ? `${p.year_released} model — ${p.paddle_type || p.shape.trim()}`
      : `${p.paddle_type || p.shape.trim()} paddle`;

  return { paddle: p, score, reason };
}

function getProfileDescriptionA(answers: RouteAAnswers): string {
  const impMap: Record<string, string> = {
    more_power: "more power",
    more_control: "better control",
    more_spin: "more spin",
    better_sweetspot: "a bigger sweet spot",
    lighter: "lighter weight",
    heavier: "more stability",
    different_shape: "a different shape",
    better_pop: "better pop at the net",
  };
  const wants = answers.improvements.map((i) => impMap[i] || i).slice(0, 3);
  const currentName = answers.currentPaddle
    ? `${answers.currentPaddle.brand} ${answers.currentPaddle.paddle_name}`
    : `${answers.customBrand} ${answers.customModel}`;

  const goalText =
    answers.goal === "replacement"
      ? "a similar paddle that improves on"
      : answers.goal === "complement"
      ? "a paddle with different strengths, especially"
      : "paddles that offer";

  return `Based on your ${currentName}, you're looking for ${goalText} ${wants.join(", ")}. We factored in your play style and what you already love about your current paddle.`;
}

function getProfileDescriptionB(answers: RouteBAnswers): string {
  const parts: string[] = [];

  if (answers.gameStyle === "aggressive")
    parts.push("a power-oriented paddle for aggressive play");
  else if (answers.gameStyle === "defensive")
    parts.push("a control paddle for your soft game");
  else parts.push("an all-court paddle for balanced play");

  if (answers.shape !== "any") {
    const shapeNames: Record<string, string> = {
      elongated: "elongated shape for extra reach",
      hybrid: "hybrid shape for versatility",
      widebody: "widebody shape for a bigger sweet spot",
    };
    parts.push(`in a ${shapeNames[answers.shape]}`);
  }

  const prioNames: Record<string, string> = {
    power: "power",
    spin: "spin generation",
    control: "control & touch",
    forgiveness: "forgiveness",
    speed: "speed & maneuverability",
  };
  if (answers.priorities.length > 0) {
    parts.push(
      `with emphasis on ${answers.priorities.map((p) => prioNames[p] || p).join(" and ")}`
    );
  }

  return `You'd do best with ${parts.join(", ")}. Here are our top picks for you.`;
}

// ─── UI Components ────────────────────────────────────────────────────────────

function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs text-[#6B6B6B] mb-2">
        <span>
          Step {current + 1} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2.5 bg-[#1A4D2E]/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#1A4D2E] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function OptionCard({
  emoji,
  label,
  desc,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  desc?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 min-h-[60px] rounded-2xl border-2 text-left transition-all duration-200 hover:border-[#1A4D2E] hover:bg-[#1A4D2E]/5 hover:shadow-warm ${
        selected
          ? "border-[#1A4D2E] bg-[#1A4D2E]/5 ring-2 ring-[#1A4D2E]/20"
          : "border-[#1A4D2E]/10 bg-[#FFFDF9]"
      }`}
    >
      <span className="text-2xl flex-shrink-0">{emoji}</span>
      <div className="min-w-0">
        <span className="font-medium text-[#1A1A1A]">{label}</span>
        {desc && (
          <div className="text-xs text-[#6B6B6B] mt-0.5">{desc}</div>
        )}
      </div>
    </button>
  );
}

function MultiSelectCard({
  emoji,
  label,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 min-h-[60px] rounded-2xl border-2 text-left transition-all duration-200 hover:border-[#1A4D2E] hover:shadow-warm ${
        selected
          ? "border-[#1A4D2E] bg-[#1A4D2E]/5"
          : "border-[#1A4D2E]/10 bg-[#FFFDF9]"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          selected
            ? "border-[#1A4D2E] bg-[#1A4D2E] text-white"
            : "border-[#1A4D2E]/20"
        }`}
      >
        {selected && (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-xl flex-shrink-0">{emoji}</span>
      <span className="font-medium text-[#1A1A1A]">{label}</span>
    </button>
  );
}

function PrioritySelect({
  options,
  selected,
  onToggle,
  max,
}: {
  options: { label: string; value: string; emoji: string }[];
  selected: string[];
  onToggle: (v: string) => void;
  max: number;
}) {
  return (
    <div className="space-y-3">
      <div className="text-center text-sm text-[#6B6B6B] mb-2">
        Pick your top {max} (tap to select/deselect)
      </div>
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        const isDisabled = !isSelected && selected.length >= max;
        return (
          <button
            key={opt.value}
            onClick={() => !isDisabled && onToggle(opt.value)}
            disabled={isDisabled}
            className={`w-full flex items-center gap-3 p-4 min-h-[60px] rounded-2xl border-2 text-left transition-all duration-200 ${
              isSelected
                ? "border-[#1A4D2E] bg-[#1A4D2E]/5"
                : isDisabled
                ? "border-[#1A4D2E]/5 bg-[#FFFDF9]/50 opacity-50"
                : "border-[#1A4D2E]/10 bg-[#FFFDF9] hover:border-[#1A4D2E] hover:shadow-warm"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all ${
                isSelected
                  ? "border-[#1A4D2E] bg-[#1A4D2E] text-white"
                  : "border-[#1A4D2E]/20"
              }`}
            >
              {isSelected ? selected.indexOf(opt.value) + 1 : ""}
            </div>
            <span className="text-xl flex-shrink-0">{opt.emoji}</span>
            <span className="font-medium text-[#1A1A1A]">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function StepWrapper({
  children,
  stepKey,
}: {
  children: React.ReactNode;
  stepKey: string;
}) {
  return (
    <div className="animate-fade-in" key={stepKey}>
      {children}
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-6 text-sm text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors flex items-center gap-1"
    >
      ← Back
    </button>
  );
}

function ContinueButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mt-6 w-full py-4 rounded-full font-semibold text-white transition-all ${
        disabled
          ? "bg-[#1A4D2E]/30 cursor-not-allowed"
          : "bg-[#1A4D2E] hover:bg-[#153D24] shadow-sm hover:shadow-md"
      }`}
    >
      {label || "Continue →"}
    </button>
  );
}

// ─── Results Component ────────────────────────────────────────────────────────

function ResultsView({
  results,
  profileDesc,
  onRestart,
}: {
  results: ScoredPaddle[];
  profileDesc: string;
  onRestart: () => void;
}) {
  const router = useRouter();

  const handleCompare = useCallback(() => {
    const names = results.map(
      (r) => `${r.paddle.brand} ${r.paddle.paddle_name}`
    );
    localStorage.setItem("comparePaddles", JSON.stringify(names));
    router.push("/compare");
  }, [results, router]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="font-display text-3xl font-bold mb-4">
          We found your match!
        </h1>
        <div className="bg-[#FFFDF9] border border-[#1A4D2E]/10 rounded-2xl p-5 mb-4">
          <h2 className="font-display text-lg font-bold text-[#1A4D2E] mb-2">
            Your Paddle Profile
          </h2>
          <p className="text-[#6B6B6B] text-sm leading-relaxed">
            {profileDesc}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {results.map((r, i) => (
          <div
            key={i}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div
              className={`${resultCardColors[i]} rounded-3xl border border-[#1A4D2E]/8 overflow-hidden transition-all hover:shadow-warm-lg`}
            >
              <div className="relative">
                <PaddleImage
                  src={r.paddle.image_url}
                  alt={`${r.paddle.brand} ${r.paddle.paddle_name}`}
                  height={140}
                />
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[#1A4D2E] text-white font-bold flex items-center justify-center text-sm shadow">
                  {i + 1}
                </div>
              </div>
              <div className="p-5">
                <div className="text-xs font-semibold text-[#1A4D2E] uppercase tracking-wide">
                  {r.paddle.brand}
                </div>
                <h3 className="font-display font-bold text-lg text-[#1A1A1A]">
                  {r.paddle.paddle_name}
                </h3>
                <p className="text-xs text-[#1A4D2E]/80 mt-1 mb-3 italic">
                  {r.reason}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {r.paddle.shape && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A1A]/5 text-[#6B6B6B]">
                      {r.paddle.shape.trim()}
                    </span>
                  )}
                  {r.paddle.paddle_type && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A4D2E] text-white">
                      {r.paddle.paddle_type}
                    </span>
                  )}
                  {r.paddle.build_style && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A1A]/5 text-[#6B6B6B]">
                      {r.paddle.build_style}
                    </span>
                  )}
                  {r.paddle.year_released && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#F2B63C]/30 text-[#1A1A1A]">
                      {r.paddle.year_released}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center">
                  <Stat label="SW" val={r.paddle.swingweight} />
                  <Stat label="TW" val={r.paddle.twistweight} />
                  <Stat
                    label="Weight"
                    val={
                      r.paddle.weight_oz
                        ? `${r.paddle.weight_oz}oz`
                        : "—"
                    }
                  />
                  <Stat label="Spin" val={r.paddle.spin_rpm || "—"} />
                  <Stat label="Power" val={r.paddle.power_mph || "—"} />
                  <Stat
                    label="Pop"
                    val={r.paddle.pop_mph || "—"}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          onClick={handleCompare}
          className="flex-1 px-6 py-4 bg-[#1A4D2E] text-white rounded-full font-semibold hover:bg-[#153D24] transition-colors"
        >
          📊 Compare These 5
        </button>
        <button
          onClick={onRestart}
          className="flex-1 px-6 py-4 bg-[#FFFDF9] border-2 border-[#1A4D2E]/20 text-[#1A4D2E] rounded-full font-semibold hover:border-[#1A4D2E] transition-colors"
        >
          🔄 Retake Quiz
        </button>
      </div>
    </div>
  );
}

function Stat({ label, val }: { label: string; val: string }) {
  return (
    <div>
      <div className="text-[10px] text-[#6B6B6B]/70 uppercase">{label}</div>
      <div className="text-xs font-semibold text-[#1A1A1A]/80">
        {val || "—"}
      </div>
    </div>
  );
}

// ─── Main Quiz Page ───────────────────────────────────────────────────────────

export default function QuizPage() {
  const [route, setRoute] = useState<Route>(null);

  // Route A state
  const [stepA, setStepA] = useState(0);
  const [routeA, setRouteA] = useState<RouteAAnswers>({
    currentPaddle: null,
    customBrand: "",
    customModel: "",
    likes: [],
    improvements: [],
    playStyle: "",
    skillLevel: "",
    goal: "",
  });

  // Route B state
  const [stepB, setStepB] = useState(0);
  const [routeB, setRouteB] = useState<RouteBAnswers>({
    skillLevel: "",
    playStyle: "",
    gameStyle: "",
    priorities: [],
    shape: "",
    gripSize: "",
    coreThickness: "",
  });

  const [showResults, setShowResults] = useState(false);

  const norm = useMemo(() => normalizeStats(paddles), []);

  const resultsA = useMemo(() => {
    if (!showResults || route !== "A") return [];
    return paddles
      .map((p) => scoreRouteA(p, routeA, norm))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [showResults, route, routeA, norm]);

  const resultsB = useMemo(() => {
    if (!showResults || route !== "B") return [];
    return paddles
      .map((p) => scoreRouteB(p, routeB, norm))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [showResults, route, routeB, norm]);

  const restart = () => {
    setRoute(null);
    setStepA(0);
    setStepB(0);
    setRouteA({
      currentPaddle: null,
      customBrand: "",
      customModel: "",
      likes: [],
      improvements: [],
      playStyle: "",
      skillLevel: "",
      goal: "",
    });
    setRouteB({
      skillLevel: "",
      playStyle: "",
      gameStyle: "",
      priorities: [],
      shape: "",
      gripSize: "",
      coreThickness: "",
    });
    setShowResults(false);
  };

  // ─── Results ────────────────────────────────────────────────────────────────

  if (showResults) {
    const results = route === "A" ? resultsA : resultsB;
    const profileDesc =
      route === "A"
        ? getProfileDescriptionA(routeA)
        : getProfileDescriptionB(routeB);
    return (
      <ResultsView
        results={results}
        profileDesc={profileDesc}
        onRestart={restart}
      />
    );
  }

  // ─── Route Selection (Step 0) ───────────────────────────────────────────────

  if (route === null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-10 animate-fade-in">
          <div className="text-5xl mb-4">🏓</div>
          <h1 className="font-display text-3xl font-bold text-[#1A1A1A] mb-3">
            Find Your Perfect Paddle
          </h1>
          <p className="text-[#6B6B6B] max-w-md mx-auto">
            Answer a few quick questions and we&apos;ll recommend the best
            paddles for your game.
          </p>
        </div>

        <div className="text-center mb-6">
          <h2 className="font-display text-xl font-bold text-[#1A1A1A]">
            Do you currently have a main paddle?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up">
          <button
            onClick={() => setRoute("A")}
            className="group p-8 rounded-3xl border-2 border-[#1A4D2E]/10 bg-[#FFFDF9] hover:border-[#1A4D2E] hover:shadow-warm-lg transition-all text-center"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              🏓
            </div>
            <h3 className="font-display font-bold text-lg text-[#1A1A1A] mb-2">
              Yes, I have a paddle
            </h3>
            <p className="text-sm text-[#6B6B6B]">
              Find an upgrade or complement to your current setup
            </p>
          </button>

          <button
            onClick={() => setRoute("B")}
            className="group p-8 rounded-3xl border-2 border-[#1A4D2E]/10 bg-[#FFFDF9] hover:border-[#1A4D2E] hover:shadow-warm-lg transition-all text-center"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              🔍
            </div>
            <h3 className="font-display font-bold text-lg text-[#1A1A1A] mb-2">
              No, I&apos;m looking for my first
            </h3>
            <p className="text-sm text-[#6B6B6B]">
              We&apos;ll help you discover the right paddle from scratch
            </p>
          </button>
        </div>
      </div>
    );
  }

  // ─── Route A Steps ──────────────────────────────────────────────────────────

  if (route === "A") {
    const totalSteps = 6;

    const goBackA = () => {
      if (stepA === 0) setRoute(null);
      else setStepA(stepA - 1);
    };

    // Step 1: Select current paddle
    if (stepA === 0) {
      const canContinue =
        routeA.currentPaddle !== null ||
        (routeA.customBrand.trim() !== "" &&
          routeA.customModel.trim() !== "");
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ProgressBar current={stepA} total={totalSteps} />
          <StepWrapper stepKey="a-0">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🏓</div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
                What paddle do you currently use?
              </h2>
            </div>
            <PaddleSearch
              selected={routeA.currentPaddle}
              onSelect={(p) =>
                setRouteA({ ...routeA, currentPaddle: p })
              }
            />
            {!routeA.currentPaddle && (
              <div className="mt-4">
                <div className="text-sm text-[#6B6B6B] text-center mb-3">
                  Can&apos;t find it? Enter manually:
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={routeA.customBrand}
                    onChange={(e) =>
                      setRouteA({
                        ...routeA,
                        customBrand: e.target.value,
                      })
                    }
                    placeholder="Brand"
                    className="p-3 rounded-xl border-2 border-[#1A4D2E]/10 bg-[#FFFDF9] focus:border-[#1A4D2E] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={routeA.customModel}
                    onChange={(e) =>
                      setRouteA({
                        ...routeA,
                        customModel: e.target.value,
                      })
                    }
                    placeholder="Model"
                    className="p-3 rounded-xl border-2 border-[#1A4D2E]/10 bg-[#FFFDF9] focus:border-[#1A4D2E] focus:outline-none"
                  />
                </div>
              </div>
            )}
            <ContinueButton
              onClick={() => setStepA(1)}
              disabled={!canContinue}
            />
            <BackButton onClick={goBackA} />
          </StepWrapper>
        </div>
      );
    }

    // Step 2: Likes
    if (stepA === 1) {
      const toggleLike = (v: string) => {
        const likes = routeA.likes.includes(v)
          ? routeA.likes.filter((l) => l !== v)
          : [...routeA.likes, v];
        setRouteA({ ...routeA, likes });
      };
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ProgressBar current={stepA} total={totalSteps} />
          <StepWrapper stepKey="a-1">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">❤️</div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
                What do you like about your current paddle?
              </h2>
              <p className="text-sm text-[#6B6B6B] mt-2">
                Select all that apply
              </p>
            </div>
            <div className="space-y-3">
              {LIKES_OPTIONS.map((opt) => (
                <MultiSelectCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={routeA.likes.includes(opt.value)}
                  onClick={() => toggleLike(opt.value)}
                />
              ))}
            </div>
            <ContinueButton
              onClick={() => setStepA(2)}
              disabled={routeA.likes.length === 0}
            />
            <BackButton onClick={goBackA} />
          </StepWrapper>
        </div>
      );
    }

    // Step 3: Improvements
    if (stepA === 2) {
      const toggleImp = (v: string) => {
        const improvements = routeA.improvements.includes(v)
          ? routeA.improvements.filter((i) => i !== v)
          : [...routeA.improvements, v];
        setRouteA({ ...routeA, improvements });
      };
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ProgressBar current={stepA} total={totalSteps} />
          <StepWrapper stepKey="a-2">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔧</div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
                What would you improve?
              </h2>
              <p className="text-sm text-[#6B6B6B] mt-2">
                Select all that apply
              </p>
            </div>
            <div className="space-y-3">
              {IMPROVEMENTS_OPTIONS.map((opt) => (
                <MultiSelectCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={routeA.improvements.includes(opt.value)}
                  onClick={() => toggleImp(opt.value)}
                />
              ))}
            </div>
            <ContinueButton
              onClick={() => setStepA(3)}
              disabled={routeA.improvements.length === 0}
            />
            <BackButton onClick={goBackA} />
          </StepWrapper>
        </div>
      );
    }

    // Step 4: Play style
    if (stepA === 3) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ProgressBar current={stepA} total={totalSteps} />
          <StepWrapper stepKey="a-3">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🏸</div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
                How do you mainly play?
              </h2>
            </div>
            <div className="space-y-3">
              {PLAY_STYLE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={routeA.playStyle === opt.value}
                  onClick={() => {
                    setRouteA({ ...routeA, playStyle: opt.value });
                    setTimeout(() => setStepA(4), 250);
                  }}
                />
              ))}
            </div>
            <BackButton onClick={goBackA} />
          </StepWrapper>
        </div>
      );
    }

    // Step 5: Skill level
    if (stepA === 4) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ProgressBar current={stepA} total={totalSteps} />
          <StepWrapper stepKey="a-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🎓</div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
                What&apos;s your skill level?
              </h2>
            </div>
            <div className="space-y-3">
              {SKILL_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={routeA.skillLevel === opt.value}
                  onClick={() => {
                    setRouteA({
                      ...routeA,
                      skillLevel: opt.value,
                    });
                    setTimeout(() => setStepA(5), 250);
                  }}
                />
              ))}
            </div>
            <BackButton onClick={goBackA} />
          </StepWrapper>
        </div>
      );
    }

    // Step 6: Goal
    if (stepA === 5) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ProgressBar current={stepA} total={totalSteps} />
          <StepWrapper stepKey="a-5">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🎯</div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
                Are you looking for:
              </h2>
            </div>
            <div className="space-y-3">
              {GOAL_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={routeA.goal === opt.value}
                  onClick={() => {
                    setRouteA({ ...routeA, goal: opt.value });
                    setTimeout(() => setShowResults(true), 300);
                  }}
                />
              ))}
            </div>
            <BackButton onClick={goBackA} />
          </StepWrapper>
        </div>
      );
    }
  }

  // ─── Route B Steps ──────────────────────────────────────────────────────────

  if (route === "B") {
    const totalSteps = 7;

    const goBackB = () => {
      if (stepB === 0) setRoute(null);
      else setStepB(stepB - 1);
    };

    // Step 1: Skill level
    if (stepB === 0) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ProgressBar current={stepB} total={totalSteps} />
          <StepWrapper stepKey="b-0">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🎓</div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
                What&apos;s your skill level?
              </h2>
            </div>
            <div className="space-y-3">
              {SKILL_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={routeB.skillLevel === opt.value}
                  onClick={() => {
                    setRouteB({
                      ...routeB,
                      skillLevel: opt.value,
                    });
                    setTimeout(() => setStepB(1), 250);
                  }}
                />
              ))}
            </div>
            <BackButton onClick={goBackB} />
          </StepWrapper>
        </div>
      );
    }

    // Step 2: Play style
    if (stepB === 1) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ProgressBar current={stepB} total={totalSteps} />
          <StepWrapper stepKey="b-1">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🏸</div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
                How do you mainly play?
              </h2>
            </div>
            <div className="space-y-3">
              {PLAY_STYLE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={routeB.playStyle === opt.value}
                  onClick={() => {
                    setRouteB({
                      ...routeB,
                      playStyle: opt.value,
                    });
                    setTimeout(() => setStepB(2), 250);
                  }}
                />
              ))}
            </div>
            <BackButton onClick={goBackB} />
          </StepWrapper>
        </div>
      );
    }

    // Step 3: Game style
    if (stepB === 2) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ProgressBar current={stepB} total={totalSteps} />
          <StepWrapper stepKey="b-2">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🎭</div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
                What&apos;s your play style?
              </h2>
            </div>
            <div className="space-y-3">
              {GAME_STYLE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  desc={opt.desc}
                  selected={routeB.gameStyle === opt.value}
                  onClick={() => {
                    setRouteB({
                      ...routeB,
                      gameStyle: opt.value,
                    });
                    setTimeout(() => setStepB(3), 250);
                  }}
                />
              ))}
            </div>
            <BackButton onClick={goBackB} />
          </StepWrapper>
        </div>
      );
    }

    // Step 4: Priorities (pick top 2)
    if (stepB === 3) {
      const togglePriority = (v: string) => {
        const prios = routeB.priorities.includes(v)
          ? routeB.priorities.filter((p) => p !== v)
          : [...routeB.priorities, v];
        setRouteB({ ...routeB, priorities: prios });
      };
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ProgressBar current={stepB} total={totalSteps} />
          <StepWrapper stepKey="b-3">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">⭐</div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
                What matters most to you?
              </h2>
            </div>
            <PrioritySelect
              options={PRIORITY_OPTIONS}
              selected={routeB.priorities}
              onToggle={togglePriority}
              max={2}
            />
            <ContinueButton
              onClick={() => setStepB(4)}
              disabled={routeB.priorities.length < 2}
            />
            <BackButton onClick={goBackB} />
          </StepWrapper>
        </div>
      );
    }

    // Step 5: Shape
    if (stepB === 4) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ProgressBar current={stepB} total={totalSteps} />
          <StepWrapper stepKey="b-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📐</div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
                Preferred paddle shape?
              </h2>
            </div>
            <div className="space-y-3">
              {SHAPE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  desc={opt.desc}
                  selected={routeB.shape === opt.value}
                  onClick={() => {
                    setRouteB({ ...routeB, shape: opt.value });
                    setTimeout(() => setStepB(5), 250);
                  }}
                />
              ))}
            </div>
            <BackButton onClick={goBackB} />
          </StepWrapper>
        </div>
      );
    }

    // Step 6: Grip size
    if (stepB === 5) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ProgressBar current={stepB} total={totalSteps} />
          <StepWrapper stepKey="b-5">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">✋</div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
                Grip size preference?
              </h2>
            </div>
            <div className="space-y-3">
              {GRIP_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={routeB.gripSize === opt.value}
                  onClick={() => {
                    setRouteB({
                      ...routeB,
                      gripSize: opt.value,
                    });
                    setTimeout(() => setStepB(6), 250);
                  }}
                />
              ))}
            </div>
            <BackButton onClick={goBackB} />
          </StepWrapper>
        </div>
      );
    }

    // Step 7: Core thickness
    if (stepB === 6) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <ProgressBar current={stepB} total={totalSteps} />
          <StepWrapper stepKey="b-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">📏</div>
              <h2 className="font-display text-2xl font-bold text-[#1A1A1A]">
                Core thickness preference?
              </h2>
            </div>
            <div className="space-y-3">
              {CORE_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  desc={opt.desc}
                  selected={routeB.coreThickness === opt.value}
                  onClick={() => {
                    setRouteB({
                      ...routeB,
                      coreThickness: opt.value,
                    });
                    setTimeout(() => setShowResults(true), 300);
                  }}
                />
              ))}
            </div>
            <BackButton onClick={goBackB} />
          </StepWrapper>
        </div>
      );
    }
  }

  return null;
}
