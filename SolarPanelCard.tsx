import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PanelStatus = "producing" | "idle" | "maintenance" | "offline";

export interface SolarPanelCardProps {
  /** Panel or array name, e.g. "Roof Array A". */
  name: string;
  /** Where the panel is, shown under the name. */
  location?: string;
  /** Current output in kW. */
  outputKw: number;
  /** Maximum rated output in kW. */
  capacityKw: number;
  /** Conversion efficiency in percent. */
  efficiency: number;
  /** Energy produced today in kWh. */
  todayKwh?: number;
  status: PanelStatus;
  /** Last update, e.g. "2 min ago". */
  updatedLabel?: string;
  /** Shows a skeleton while data loads. */
  loading?: boolean;
  /** Makes the whole card a link. */
  href?: string;
  /** Extra content under the stats, e.g. a button. */
  footer?: ReactNode;
  className?: string;
}

const statusStyles: Record<PanelStatus, { label: string; pill: string; dot: string; cells: string }> = {
  producing: { label: "Producing", pill: "bg-[#dff3e8] text-[#0e5a36]", dot: "bg-[#1f9a5e]", cells: "fill-[#1d4f7a]" },
  idle: { label: "Idle", pill: "bg-[#e7eef1] text-[#33505b]", dot: "bg-[#6c8791]", cells: "fill-[#3a5664]" },
  maintenance: { label: "Maintenance", pill: "bg-[#fff1cc] text-[#6b4a00]", dot: "bg-[#d99a00]", cells: "fill-[#3a5664]" },
  offline: { label: "Offline", pill: "bg-[#fde3e1] text-[#8a1f17]", dot: "bg-[#d0382c]", cells: "fill-[#4a5459]" },
};

function formatKw(value: number) {
  return value >= 100 ? value.toFixed(0) : value.toFixed(1);
}

export default function SolarPanelCard({
  name,
  location,
  outputKw,
  capacityKw,
  efficiency,
  todayKwh,
  status,
  updatedLabel,
  loading = false,
  href,
  footer,
  className,
}: SolarPanelCardProps) {
  const base = "relative flex flex-col overflow-hidden rounded-2xl border border-[#c4d6dc] bg-white text-[#0f2a33]";

  if (loading) {
    return (
      <div className={cn(base, "p-5", className)} aria-busy="true" aria-label={`Loading ${name}`}>
        <div className="animate-pulse motion-reduce:animate-none">
          <div className="h-20 rounded-xl bg-[#e3ecef]" />
          <div className="mt-4 h-5 w-2/3 rounded bg-[#e3ecef]" />
          <div className="mt-2 h-4 w-1/3 rounded bg-[#e3ecef]" />
          <div className="mt-5 h-2 rounded-full bg-[#e3ecef]" />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="h-10 rounded bg-[#e3ecef]" />
            <div className="h-10 rounded bg-[#e3ecef]" />
          </div>
        </div>
      </div>
    );
  }

  const s = statusStyles[status];
  const load = capacityKw > 0 ? Math.min(1, Math.max(0, outputKw / capacityKw)) : 0;
  const isProducing = status === "producing";

  const body = (
    <>
      {/* panel graphic: 6x3 cells, sun glare only while producing */}
      <div className="relative h-20 overflow-hidden rounded-xl bg-[#cfe6ef]">
        <svg viewBox="0 0 240 80" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <rect key={i} x={12 + (i % 6) * 37} y={10 + Math.floor(i / 6) * 21} width="34" height="18" rx="2" className={s.cells} />
          ))}
          {isProducing && (
            <>
              <circle cx="240" cy="0" r="18" fill="#ffc42e" />
              <path d="M30 70 L170 10 L200 10 L60 70 Z" fill="white" opacity="0.18" />
            </>
          )}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold leading-tight">{name}</h3>
          {location && <p className="mt-0.5 truncate text-sm text-[#45616c]">{location}</p>}
        </div>
        <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", s.pill)}>
          <span className={cn("size-2 rounded-full", s.dot)} aria-hidden="true" />
          {s.label}
        </span>
      </div>

      {/* output vs capacity */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-2">
          <p>
            <span className="text-3xl font-extrabold tracking-tight">{formatKw(outputKw)}</span>
            <span className="ml-1 text-sm text-[#45616c]">/ {formatKw(capacityKw)} kW</span>
          </p>
          <span className="text-sm text-[#45616c]">{Math.round(load * 100)}% of capacity</span>
        </div>
        <div
          role="meter"
          aria-label="Output compared to capacity"
          aria-valuemin={0}
          aria-valuemax={capacityKw}
          aria-valuenow={outputKw}
          aria-valuetext={`${formatKw(outputKw)} of ${formatKw(capacityKw)} kilowatts`}
          className="mt-2 h-2 overflow-hidden rounded-full bg-[#e3ecef]"
        >
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#ffb000,#ffd86b)] transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${load * 100}%` }}
          />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-[#e3ecef] pt-4 text-sm">
        <div>
          <dt className="text-[#45616c]">Efficiency</dt>
          <dd className="text-base font-semibold">{efficiency.toFixed(1)}%</dd>
        </div>
        {todayKwh !== undefined && (
          <div>
            <dt className="text-[#45616c]">Today</dt>
            <dd className="text-base font-semibold">{todayKwh.toFixed(1)} kWh</dd>
          </div>
        )}
      </dl>

      {updatedLabel && <p className="mt-3 text-xs text-[#45616c]">Updated {updatedLabel}</p>}
    </>
  );

  if (href) {
    return (
      <div className={cn(base, "transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(15,42,51,0.12)] has-[a:active]:translate-y-0 has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-[#157548] motion-reduce:transition-none motion-reduce:hover:translate-y-0", className)}>
        <a href={href} className="flex flex-col p-5 outline-none">
          {body}
        </a>
        {footer && <div className="px-5 pb-5">{footer}</div>}
      </div>
    );
  }

  return (
    <article className={cn(base, "p-5", className)}>
      {body}
      {footer && <div className="mt-4">{footer}</div>}
    </article>
  );
}
