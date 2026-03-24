"use client";
import { Paddle, num } from "@/types/paddle";

interface Props {
  paddle: Paddle;
  onClick?: () => void;
  selected?: boolean;
  onAdd?: () => void;
  compact?: boolean;
}

function PaddleImage({ src, alt, height = 150 }: { src?: string; alt: string; height?: number }) {
  if (!src) {
    return (
      <div
        className="w-full flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height }}
      >
        <span className="text-4xl">🏓</span>
      </div>
    );
  }
  return (
    <div
      className="w-full flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden"
      style={{ height }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain p-2"
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = "none";
          const parent = target.parentElement;
          if (parent) {
            parent.classList.replace("bg-gray-50", "bg-gray-100");
            const emoji = document.createElement("span");
            emoji.className = "text-4xl";
            emoji.textContent = "🏓";
            parent.appendChild(emoji);
          }
        }}
      />
    </div>
  );
}

export { PaddleImage };

export default function PaddleCard({ paddle, onClick, selected, onAdd, compact }: Props) {
  const p = paddle;
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-xl border bg-white overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        selected ? "border-lime-400 ring-2 ring-lime-200" : "border-gray-200 hover:border-lime-300"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      {onAdd && (
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-lime-500 text-white text-lg flex items-center justify-center hover:bg-lime-600 transition-colors shadow-sm"
          title="Add to compare"
        >
          +
        </button>
      )}
      <PaddleImage src={p.image_url} alt={`${p.brand} ${p.paddle_name}`} />
      <div className="p-4">
        <div className="text-xs font-medium text-lime-600 uppercase tracking-wide mb-1">{p.brand}</div>
        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-2">{p.paddle_name}</h3>
        {!compact && (
          <>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {p.shape && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p.shape.trim()}</span>}
              {p.paddle_type && <span className="text-xs px-2 py-0.5 rounded-full bg-lime-50 text-lime-700">{p.paddle_type}</span>}
              {p.build_style && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{p.build_style}</span>}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <StatMini label="SW" value={p.swingweight} />
              <StatMini label="TW" value={p.twistweight} />
              <StatMini label="Weight" value={p.weight_oz ? `${p.weight_oz}oz` : "—"} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-1">
              <StatMini label="Spin" value={p.spin_rpm ? `${p.spin_rpm}` : "—"} />
              <StatMini label="Power" value={p.power_mph ? `${p.power_mph}` : "—"} />
              <StatMini label="Core" value={p.core_thickness_mm ? `${p.core_thickness_mm}mm` : "—"} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-gray-400 uppercase">{label}</div>
      <div className="text-xs font-semibold text-gray-700">{value || "—"}</div>
    </div>
  );
}
