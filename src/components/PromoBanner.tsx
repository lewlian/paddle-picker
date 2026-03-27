"use client";
import { useState, useEffect, useCallback } from "react";

const promos = [
  {
    id: "rpm",
    brand: "RPM",
    headline: "15% OFF ALL RPM PADDLES",
    code: "SEANLEW15",
    tagline: "Unmatched Spin. Next-Level Power. Total Control.",
    cta: "Shop RPM Now",
    href: "https://rpmpb.com/SEANLEW15",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0690/0891/6654/files/RPM_PRO_16MM_1_3D2.png?v=1755909107",
    imageUrl2:
      "https://cdn.shopify.com/s/files/1/0690/0891/6654/files/RPM_PRO_16MM_2_3D2.png?v=1755909107",
    bgFrom: "#A42325",
    bgTo: "#7A0406",
    accent: "#FF6B6B",
    badgeBg: "rgba(255,255,255,0.15)",
  },
  {
    id: "crbn",
    brand: "CRBN",
    headline: "10% OFF ALL CRBN PADDLES",
    code: "lewlian",
    tagline: "Carbon Fiber Performance. Engineered to Dominate.",
    cta: "Shop CRBN Now",
    href: "https://crbnpickleball.com/collections/pickleball-paddles",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0577/8944/8344/files/CRBN_TruFoamBarrage_03_AltMain_TFB1.jpg?v=1773237014",
    imageUrl2:
      "https://cdn.sanity.io/images/zuyt4kfy/production/cc0b462fb5a01a1fd59efd5b65f42d8617a1748b-4501x4501.png",
    bgFrom: "#191919",
    bgTo: "#2D2D2D",
    accent: "#13A165",
    badgeBg: "rgba(19,161,101,0.2)",
  },
];

export default function PromoBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sliding, setSliding] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === current) return;
      setSliding(true);
      setTimeout(() => {
        setCurrent(idx);
        setSliding(false);
      }, 300);
    },
    [current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % promos.length);
  }, [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [paused, next]);

  const promo = promos[current];

  return (
    <div
      className="promo-carousel relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${promo.bgFrom} 0%, ${promo.bgTo} 100%)`,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-[3px] w-full z-10">
        <div
          className="h-full"
          style={{
            background: promo.accent,
            animation: paused ? "none" : "promoProgress 6s linear infinite",
          }}
        />
      </div>

      <a
        href={promo.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div
          className={`max-w-6xl mx-auto px-4 sm:px-8 py-5 sm:py-6 flex items-center gap-6 sm:gap-10 transition-all duration-300 ${
            sliding ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"
          }`}
        >
          {/* Paddle images */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <img
              src={promo.imageUrl}
              alt={promo.brand}
              className="w-24 h-24 lg:w-28 lg:h-28 object-contain drop-shadow-2xl hover:scale-105 transition-transform"
            />
            <img
              src={promo.imageUrl2}
              alt={promo.brand}
              className="w-20 h-20 lg:w-24 lg:h-24 object-contain drop-shadow-xl opacity-60 -ml-4 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Mobile image */}
          <div className="md:hidden shrink-0">
            <img
              src={promo.imageUrl}
              alt={promo.brand}
              className="w-16 h-16 object-contain drop-shadow-xl"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Discount badge */}
            <div
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2"
              style={{
                background: promo.badgeBg,
                color: promo.accent,
              }}
            >
              Limited Offer
            </div>

            <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
              {promo.headline}
            </h3>

            <p className="text-white/50 text-xs sm:text-sm mt-1 hidden sm:block">
              {promo.tagline}
            </p>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {/* Promo code */}
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5">
                <span className="text-white/50 text-xs">Code:</span>
                <span className="text-white font-mono font-bold text-sm sm:text-base tracking-wide">
                  {promo.code}
                </span>
              </div>

              {/* CTA button */}
              <span
                className="inline-flex items-center gap-1.5 font-semibold text-sm px-5 py-2 rounded-full transition-all hover:scale-105 hover:shadow-lg"
                style={{
                  background: promo.accent,
                  color: promo.id === "crbn" ? "#FFFFFF" : "#1A1A1A",
                }}
              >
                {promo.cta} →
              </span>
            </div>
          </div>

          {/* Nav arrows + dots */}
          <div className="hidden sm:flex flex-col items-center gap-3 shrink-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goTo((current - 1 + promos.length) % promos.length);
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all text-sm"
              aria-label="Previous promo"
            >
              ‹
            </button>
            <div className="flex flex-col gap-1.5">
              {promos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goTo(i);
                  }}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    background:
                      i === current ? "#FFFFFF" : "rgba(255,255,255,0.3)",
                    transform: i === current ? "scale(1.4)" : "scale(1)",
                  }}
                  aria-label={`Show ${promos[i].brand} promo`}
                />
              ))}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                next();
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all text-sm"
              aria-label="Next promo"
            >
              ›
            </button>
          </div>
        </div>
      </a>
    </div>
  );
}
