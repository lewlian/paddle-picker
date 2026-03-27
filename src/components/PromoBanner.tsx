"use client";
import { useState, useEffect, useCallback } from "react";

const promos = [
  {
    id: "rpm",
    brand: "RPM",
    headline: "15% OFF RPM Paddles",
    code: "SEANLEW15",
    description: "Unmatched Spin. Next-Level Power.",
    href: "https://rpmpb.com/SEANLEW15",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0690/0891/6654/files/RPM_PRO_16MM_1_3D2.png?v=1755909107",
    bgFrom: "#A42325",
    bgTo: "#7A0406",
    accent: "#FF6B6B",
  },
  {
    id: "crbn",
    brand: "CRBN",
    headline: "10% OFF CRBN Paddles",
    code: "lewlian",
    description: "Carbon Fiber Performance.",
    href: "https://crbnpickleball.com/collections/pickleball-paddles",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0577/8944/8344/files/CRBN_TruFoamBarrage_03_AltMain_TFB1.jpg?v=1773237014",
    bgFrom: "#191919",
    bgTo: "#2D2D2D",
    accent: "#13A165",
  },
];

export default function PromoBanner() {
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % promos.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [paused, next]);

  if (dismissed) return null;

  const promo = promos[current];

  return (
    <div
      className="promo-banner relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${promo.bgFrom} 0%, ${promo.bgTo} 100%)`,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <a
        href={promo.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 sm:gap-5 min-h-[48px]">
          {/* Paddle image — hidden on very small screens */}
          <div className="hidden sm:block shrink-0 w-10 h-10 relative">
            <img
              src={promo.imageUrl}
              alt={promo.brand}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>

          {/* Text content */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center text-white">
            <span
              className="font-display font-bold text-sm sm:text-base tracking-wide"
              style={{ color: promo.accent }}
            >
              {promo.headline}
            </span>
            <span className="hidden md:inline text-white/60 text-xs">
              {promo.description}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-mono font-semibold px-2.5 py-1 rounded-md border border-white/20">
              Code: {promo.code}
            </span>
            <span className="text-white/80 text-xs font-semibold hover:text-white transition-colors">
              Shop Now →
            </span>
          </div>

          {/* Dot indicators */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            {promos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                style={{
                  background: i === current ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                  transform: i === current ? "scale(1.3)" : "scale(1)",
                }}
                aria-label={`Show ${promos[i].brand} promo`}
              />
            ))}
          </div>
        </div>
      </a>

      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors text-xs px-1.5 py-0.5"
        aria-label="Dismiss banner"
      >
        ✕
      </button>
    </div>
  );
}
