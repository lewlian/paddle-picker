"use client";
import { Paddle, num } from "@/types/paddle";

interface Props {
  paddle: Paddle;
  onClick?: () => void;
  selected?: boolean;
  onAdd?: () => void;
  compact?: boolean;
}

export default function PaddleCard({ paddle, onClick, selected, onAdd, compact }: Props) {
  const p = paddle;
  return (
    <div
      onClick={onClick}
      className={`group relative rounded-xl border bg-white p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        selected ? "border-lime-400 ring-2 ring-lime-200" : "border-gray-200 hover:border-lime-300"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      {onAdd && (
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-lime-500 text-white text-lg flex items-center justify-center hover:bg-lime-600 transition-colors shadow-sm"
          title="Add to compare"
        >
          +
        </button>
      )}
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
