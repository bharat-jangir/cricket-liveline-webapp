"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Rec } from "@/lib/types";
import { formatDate, formatLabel } from "@/lib/format";

/** Featured-series banner (the mobile home's rotating hero). Pauses on hover/focus; no motion if the user prefers none. */
export function FeaturedHero({ series }: { series: Rec[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const items = series.slice(0, 5);

  useEffect(() => {
    if (items.length < 2 || paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length, paused]);

  const cur = items[i];
  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured series"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0284c7] via-[#1877f2] to-[#1e40af] text-white shadow-[var(--shadow)]"
    >
      <div className="px-6 py-8 sm:px-10 sm:py-12 min-h-[190px] flex flex-col justify-center">
        {cur ? (
          <Link href={`/series/${cur._id}`} className="block focus-visible:outline-white" aria-live="polite">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Featured series{cur.activeFormat ? ` · ${formatLabel(cur.activeFormat)}` : ""}</p>
            <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-tight">{cur.name}</h2>
            <p className="mt-2 text-sm text-white/85">
              {formatDate(cur.startDate, true)}
              {cur.endDate ? ` – ${formatDate(cur.endDate, true)}` : ""}
            </p>
            <span className="mt-4 inline-block rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium">View series →</span>
          </Link>
        ) : (
          <div>
            <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight">Live cricket, ball by ball</h2>
            <p className="mt-2 text-white/85">Scores, scorecards and commentary as they happen.</p>
          </div>
        )}
      </div>
      {items.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {items.map((s, n) => (
            <button
              key={s._id}
              type="button"
              aria-label={`Show ${s.name}`}
              aria-current={n === i}
              onClick={() => setI(n)}
              className={`h-1.5 rounded-full transition-all ${n === i ? "w-6 bg-white" : "w-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
