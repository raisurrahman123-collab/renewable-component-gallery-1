"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

export interface CodeTab {
  label: string;
  code: string;
}

export interface CodeTabsProps {
  tabs: CodeTab[];
  className?: string;
}

export function CodeTabs({ tabs, className }: CodeTabsProps) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const id = useId();

  async function copy() {
    try {
      await navigator.clipboard.writeText(tabs[active].code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function onKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setActive(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  }

  const btn = "rounded-md px-3 py-1.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf";

  return (
    <div className={cn("flex min-w-0 flex-col overflow-hidden rounded-2xl bg-[#0f2a33] text-[#e2eef1]", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-white/10 p-2">
        <div role="tablist" aria-label="Code" className="flex gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              id={`${id}-tab-${i}`}
              role="tab"
              aria-selected={i === active}
              aria-controls={`${id}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKey}
              className={cn(btn, i === active ? "bg-white/15 text-white" : "text-white/70 hover:text-white")}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button onClick={copy} className={cn(btn, "text-white/80 hover:bg-white/10 hover:text-white")}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        tabIndex={0}
        className="max-h-[32rem] overflow-auto p-5 font-mono text-[0.85rem] leading-relaxed focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-leaf"
      >
        <code>{tabs[active].code}</code>
      </pre>
    </div>
  );
}
