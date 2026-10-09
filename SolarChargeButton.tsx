"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/Spinner";

export type SolarChargeSize = "sm" | "md" | "lg";

export interface SolarChargeButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "children"> {
  /** Text shown before and while charging. */
  label: string;
  /** Text shown for a moment after the charge completes. */
  completedLabel?: string;
  /** How long (ms) the button must be held to fully charge. */
  holdDuration?: number;
  /** How long (ms) the completed state stays before resetting. */
  resetAfter?: number;
  /** Runs once the button is fully charged. */
  onComplete?: () => void;
  /** Shows a spinner while the action you started is running. */
  loading?: boolean;
  loadingLabel?: string;
  size?: SolarChargeSize;
  fullWidth?: boolean;
}

const sizes: Record<SolarChargeSize, { button: string; icon: string }> = {
  sm: { button: "h-10 pl-2 pr-4 text-sm gap-2", icon: "size-7" },
  md: { button: "h-13 pl-2.5 pr-6 text-base gap-3", icon: "size-8" },
  lg: { button: "h-16 pl-3 pr-8 text-lg gap-3.5", icon: "size-10" },
};

export default function SolarChargeButton({
  label,
  completedLabel = "Done",
  holdDuration = 1200,
  resetAfter = 2000,
  onComplete,
  loading = false,
  loadingLabel = "Working",
  size = "md",
  fullWidth = false,
  disabled,
  className,
  type = "button",
  ...rest
}: SolarChargeButtonProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const holding = useRef(false);
  const progressRef = useRef(0);
  const frame = useRef<number | null>(null);
  const last = useRef(0);

  const locked = disabled || loading || done;

  const tick = useCallback(
    (now: number) => {
      const dt = now - last.current;
      last.current = now;
      // charge while held, drain 2.5x faster when released
      const delta = holding.current ? dt / holdDuration : -dt / (holdDuration * 0.4);
      const next = Math.min(1, Math.max(0, progressRef.current + delta));
      progressRef.current = next;
      setProgress(next);

      if (next >= 1) {
        holding.current = false;
        frame.current = null;
        setDone(true);
        onComplete?.();
        return;
      }
      if (next <= 0 && !holding.current) {
        frame.current = null;
        return;
      }
      frame.current = requestAnimationFrame(tick);
    },
    [holdDuration, onComplete],
  );

  const start = useCallback(() => {
    if (locked || holding.current) return;
    holding.current = true;
    if (frame.current === null) {
      last.current = performance.now();
      frame.current = requestAnimationFrame(tick);
    }
  }, [locked, tick]);

  const stop = useCallback(() => {
    if (!holding.current) return;
    holding.current = false;
    if (frame.current === null && progressRef.current > 0) {
      last.current = performance.now();
      frame.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  // Reset after the completed state has been shown (waits for loading to finish)
  useEffect(() => {
    if (!done || loading) return;
    const t = setTimeout(() => {
      setDone(false);
      progressRef.current = 0;
      setProgress(0);
    }, resetAfter);
    return () => clearTimeout(t);
  }, [done, loading, resetAfter]);

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!e.repeat) start();
    }
  }
  function onKeyUp(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === " " || e.key === "Enter") stop();
  }

  const percent = Math.round(progress * 100);
  const text = loading ? loadingLabel : done ? completedLabel : label;

  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={locked || undefined}
      aria-busy={loading || undefined}
      aria-label={done || loading ? text : `${label}. Press and hold to confirm.`}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        start();
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
      onLostPointerCapture={stop}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      onBlur={stop}
      onContextMenu={(e) => e.preventDefault()}
      style={{ ["--charge" as string]: `${percent}%` }}
      className={cn(
        "group relative isolate inline-flex touch-none select-none items-center overflow-hidden rounded-full font-semibold",
        "border-2 border-[#0f2a33] bg-[#fff8e0] text-[#0f2a33]",
        "transition-[box-shadow,transform] duration-150 motion-reduce:transition-none",
        "hover:shadow-[0_0_0_4px_rgba(255,196,46,0.35)] active:scale-[0.98]",
        "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#157548]",
        "disabled:cursor-not-allowed disabled:border-[#8aa0a8] disabled:bg-[#eef2f3] disabled:text-[#5b707a] disabled:hover:shadow-none disabled:active:scale-100",
        locked ? "cursor-default" : "cursor-pointer",
        sizes[size].button,
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {/* sunlight fill */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 -z-10 w-[var(--charge)] bg-[linear-gradient(90deg,#ffd86b,#ffb000)]"
      />

      {/* sun icon: rays turn and grow with the charge */}
      <span
        aria-hidden="true"
        className={cn(
          "grid shrink-0 place-items-center rounded-full bg-[#0f2a33] text-[#ffc42e] group-disabled:bg-[#8aa0a8] group-disabled:text-[#eef2f3]",
          sizes[size].icon,
        )}
      >
        {loading ? (
          <Spinner className="size-[60%] text-[#ffc42e]" />
        ) : done ? (
          <svg viewBox="0 0 24 24" className="size-[60%]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5 10 17 19 7" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="size-[70%] motion-reduce:!rotate-0"
            style={{ transform: `rotate(${progress * 180}deg)` }}
            fill="currentColor"
          >
            <circle cx="12" cy="12" r={3.5 + progress * 1.5} />
            {Array.from({ length: 8 }, (_, i) => (
              <rect
                key={i}
                x="11"
                y={1.5 + (1 - progress) * 1.5}
                width="2"
                height={3 + progress * 1.5}
                rx="1"
                transform={`rotate(${i * 45} 12 12)`}
              />
            ))}
          </svg>
        )}
      </span>

      <span className="relative whitespace-nowrap">{text}</span>

      {/* announces completion to screen readers */}
      <span className="sr-only" aria-live="polite">
        {done && !loading ? completedLabel : ""}
      </span>
    </button>
  );
}
