"use client";
import { useState, useEffect, useCallback } from "react";

type PromoSlide =
  | {
      type: "discount";
      id: string;
      brand: string;
      headline: string;
      code: string;
      tagline: string;
      cta: string;
      href: string;
      imageUrl: string;
      imageUrl2: string;
      bgFrom: string;
      bgTo: string;
      accent: string;
      badgeBg: string;
      badgeText: string;
    }
  | {
      type: "club";
      id: string;
      headline: string;
      tagline: string;
      detail: string;
      bgFrom: string;
      bgTo: string;
      accent: string;
      badgeBg: string;
      badgeText: string;
      links: { label: string; href: string; icon: "whatsapp" | "reclub" }[];
    };

const slides: PromoSlide[] = [
  {
    type: "discount",
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
    badgeText: "Limited Offer",
  },
  {
    type: "discount",
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
    badgeText: "Limited Offer",
  },
  {
    type: "club",
    id: "lss",
    headline: "JOIN LSS ACADEMY",
    tagline: "Play with us in Sengkang! Weekday mornings, 7 \u2013 10 AM.",
    detail: "Mon \u2013 Fri \u00b7 Subject to court availability",
    bgFrom: "#000000",
    bgTo: "#1A1A1A",
    accent: "#E8E0D0",
    badgeBg: "rgba(232,224,208,0.15)",
    badgeText: "Community",
    links: [
      {
        label: "Join on Reclub",
        href: "https://reclub.co/clubs/@lss-pickleball-academy",
        icon: "reclub",
      },
      {
        label: "WhatsApp Group",
        href: "https://chat.whatsapp.com/CRDYpQH0rlf36JBKjRN529?mode=gi_t",
        icon: "whatsapp",
      },
    ],
  },
];

/* Inline SVG icons */
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ReclubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h4m0 0V8m0 4l4 4" />
    </svg>
  );
}

function LSSLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" fill="currentColor" className={className}>
      {/* L */}
      <path d="M8 8 L28 8 L22 58 L62 58 L60 68 L2 68 Z" />
      {/* S (first) */}
      <path d="M72 8 L122 8 L120 16 L80 16 L78 32 L116 32 L110 68 L60 68 L62 60 L102 60 L104 44 L66 44 Z" />
      {/* S (second) */}
      <path d="M128 8 L178 8 L176 16 L136 16 L134 32 L172 32 L166 68 L116 68 L118 60 L158 60 L160 44 L122 44 Z" />
      {/* Claw slashes */}
      <path d="M150 62 L190 42 L186 46 L152 64 Z" />
      <path d="M156 66 L196 46 L192 50 L158 68 Z" />
      <path d="M162 70 L200 52 L196 56 L164 72 Z" />
    </svg>
  );
}

export default function PromoBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sliding, setSliding] = useState(false);
  const [copied, setCopied] = useState(false);

  const goTo = useCallback(
    (idx: number) => {
      if (idx === current) return;
      setSliding(true);
      setTimeout(() => {
        setCurrent(idx);
        setCopied(false);
        setSliding(false);
      }, 300);
    },
    [current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [paused, next]);

  const slide = slides[current];

  return (
    <div
      className="promo-carousel relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${slide.bgFrom} 0%, ${slide.bgTo} 100%)`,
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-[3px] w-full z-10">
        <div
          className="h-full"
          style={{
            background: slide.accent,
            animation: paused ? "none" : "promoProgress 6s linear infinite",
          }}
        />
      </div>

      {/* Slide content */}
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-8 py-5 sm:py-6 transition-all duration-300 ${
          sliding ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"
        }`}
      >
        {slide.type === "discount" ? (
          <DiscountSlide slide={slide} copied={copied} setCopied={setCopied} />
        ) : (
          <ClubSlide slide={slide} />
        )}
      </div>

      {/* Nav arrows + dots — bottom center */}
      <div className="flex items-center justify-center gap-3 pb-3 -mt-1">
        <button
          onClick={() => goTo((current - 1 + slides.length) % slides.length)}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all text-sm"
          aria-label="Previous"
        >
          ‹
        </button>
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background:
                  i === current ? "#FFFFFF" : "rgba(255,255,255,0.3)",
                transform: i === current ? "scale(1.4)" : "scale(1)",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all text-sm"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
}

/* ── Discount slide (RPM / CRBN) ── */
function DiscountSlide({
  slide,
  copied,
  setCopied,
}: {
  slide: Extract<PromoSlide, { type: "discount" }>;
  copied: boolean;
  setCopied: (v: boolean) => void;
}) {
  return (
    <a
      href={slide.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-6 sm:gap-10"
    >
      {/* Paddle images — desktop */}
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <img
          src={slide.imageUrl}
          alt={slide.brand}
          className="w-24 h-24 lg:w-28 lg:h-28 object-contain drop-shadow-2xl hover:scale-105 transition-transform"
        />
        <img
          src={slide.imageUrl2}
          alt={slide.brand}
          className="w-20 h-20 lg:w-24 lg:h-24 object-contain drop-shadow-xl opacity-60 -ml-4 hover:opacity-100 transition-opacity"
        />
      </div>

      {/* Paddle image — mobile */}
      <div className="md:hidden shrink-0">
        <img
          src={slide.imageUrl}
          alt={slide.brand}
          className="w-16 h-16 object-contain drop-shadow-xl"
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div
          className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2"
          style={{ background: slide.badgeBg, color: slide.accent }}
        >
          {slide.badgeText}
        </div>

        <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
          {slide.headline}
        </h3>

        <p className="text-white/50 text-xs sm:text-sm mt-1 hidden sm:block">
          {slide.tagline}
        </p>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5">
            <span className="text-white/50 text-xs">Code:</span>
            <span className="text-white font-mono font-bold text-sm sm:text-base tracking-wide">
              {slide.code}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigator.clipboard.writeText(slide.code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-white/40 hover:text-white transition-colors ml-0.5"
              aria-label="Copy code"
              title="Copy code"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              )}
            </button>
          </div>

          <span
            className="inline-flex items-center gap-1.5 font-semibold text-sm px-5 py-2 rounded-full transition-all hover:scale-105 hover:shadow-lg"
            style={{
              background: slide.accent,
              color: slide.id === "crbn" ? "#FFFFFF" : "#1A1A1A",
            }}
          >
            {slide.cta} →
          </span>
        </div>
      </div>
    </a>
  );
}

/* ── Club slide (LSS Academy) ── */
function ClubSlide({
  slide,
}: {
  slide: Extract<PromoSlide, { type: "club" }>;
}) {
  return (
    <div className="flex items-center gap-6 sm:gap-10">
      {/* LSS Logo — desktop */}
      <div className="hidden md:block shrink-0">
        <img src="/lss-logo.png" alt="LSS Academy" className="w-32 lg:w-40 h-auto object-contain" />
      </div>

      {/* LSS Logo — mobile */}
      <div className="md:hidden shrink-0">
        <img src="/lss-logo.png" alt="LSS Academy" className="w-20 h-auto object-contain" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div
          className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2"
          style={{ background: slide.badgeBg, color: slide.accent }}
        >
          {slide.badgeText}
        </div>

        <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
          {slide.headline}
        </h3>

        <p className="text-white/50 text-xs sm:text-sm mt-1">
          {slide.tagline}
        </p>
        <p className="text-white/30 text-[10px] sm:text-xs mt-0.5">
          {slide.detail}
        </p>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {slide.links.map((link) => (
            <a
              key={link.icon}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-sm px-4 sm:px-5 py-2 rounded-full transition-all hover:scale-105 hover:shadow-lg"
              style={{
                background:
                  link.icon === "whatsapp" ? "#25D366" : slide.accent,
                color: link.icon === "whatsapp" ? "#FFFFFF" : "#1A1A1A",
              }}
            >
              {link.icon === "whatsapp" ? (
                <WhatsAppIcon size={16} />
              ) : (
                <ReclubIcon size={16} />
              )}
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
