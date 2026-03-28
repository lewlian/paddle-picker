"use client";
import { useState, useRef } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setShow(false), 150);
  };

  return (
    <span
      className="relative inline-flex items-center gap-1 cursor-help"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={() => setShow(!show)}
    >
      {children}
      <span className="text-[#6B6B6B] text-[10px]">ⓘ</span>
      {show && (
        <span className="fixed bottom-auto left-auto mb-2 w-64 p-3 bg-[#1A4D2E] text-white text-xs leading-relaxed rounded-xl shadow-lg z-[100] pointer-events-none animate-fade-in"
          style={{ position: 'fixed' }}
          ref={(el) => {
            if (el) {
              const rect = el.parentElement?.getBoundingClientRect();
              if (rect) {
                el.style.left = `${Math.max(8, Math.min(rect.left + rect.width / 2 - 128, window.innerWidth - 272))}px`;
                el.style.top = `${rect.top - el.offsetHeight - 8}px`;
              }
            }
          }}
        >
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A4D2E]" />
        </span>
      )}
    </span>
  );
}

// Definitions for common terms
export const definitions: Record<string, string> = {
  "Gen 1": "Cold pressed — facing layers glued to the polymer core with an edge guard wrapped around. Known for plush feel and control.",
  "Gen 1.5": "Cold pressed like Gen 1, but with expanding foam injected around the perimeter. Also known for control-oriented play.",
  "Gen 2": "Thermoformed — facing layers fused with heat and a carbon fiber perimeter. Usually has foam edges. Known for power and stability.",
  "Gen 3": "Thermoformed with additional foam around the perimeter (dual foam wall). Popularized by JOOLA. Generally more power.",
  "Gen 4": "Full foam core instead of polypropylene. Popularized by CRBN. Known for enhanced feel and durability.",
  "Swingweight": "Resistance to swinging — higher = heavier feel, more power but harder to swing. Ranges from ~100 to ~140.",
  "Twistweight": "Resistance to twisting on off-center hits — higher = more forgiveness and bigger sweet spot.",
  "Balance Point": "Distance of center of gravity from the handle. Higher = more head-heavy, better drive-through but less maneuverable.",
  "Spin RPM": "Revolutions per minute off a serve. Higher = more spin potential.",
  "Power MPH": "Ball speed off a full swing. Higher = more power output.",
  "Pop MPH": "Ball speed off a short contact (volleys/dinks). Higher = more reactive.",
  "Elongated": "16.5\" × 7.5\" — more reach and leverage, popular for singles.",
  "Hybrid": "16.25\" × 7.5-7.7\" — blend of reach and sweet spot size.",
  "Widebody": "16\" × 8\" — largest sweet spot, most forgiving.",
};

// Get tooltip for a build style value
export function getBuildStyleTooltip(value: string): string | null {
  const v = value.trim();
  return definitions[v] || null;
}

// Get tooltip for any stat label
export function getStatTooltip(key: string): string | null {
  const map: Record<string, string> = {
    swingweight: definitions["Swingweight"],
    twistweight: definitions["Twistweight"],
    balance_point_mm: definitions["Balance Point"],
    spin_rpm: definitions["Spin RPM"],
    power_mph: definitions["Power MPH"],
    pop_mph: definitions["Pop MPH"],
    build_style: "The construction generation of the paddle. Tap the value to learn more.",
    shape: "The paddle's dimensions determine its shape category.",
  };
  return map[key] || null;
}
