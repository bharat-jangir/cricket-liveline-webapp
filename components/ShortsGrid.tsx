"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { Rec } from "@/lib/types";
import { EmptyState } from "./ui";

function ShortCard({ s }: { s: Rec }) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const start = () => {
    setPlaying(true);
    api(`/app/shorts/${s._id}/view`, { method: "POST" }).catch(() => undefined);
  };

  return (
    <li className="card overflow-hidden">
      <div className="relative aspect-[9/16] w-full bg-black">
        {playing && !failed ? (
          <video src={s.videoUrl} poster={s.thumbnail || undefined} controls autoPlay loop playsInline className="absolute inset-0 h-full w-full object-cover" onError={() => setFailed(true)} />
        ) : (
          <button type="button" onClick={start} className="absolute inset-0 grid place-items-center text-white" aria-label={`Play ${s.title}`}>
            {s.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.thumbnail} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            )}
            <span className="relative grid size-14 place-items-center rounded-full bg-black/55 text-2xl">{failed ? "!" : "▶"}</span>
            {failed && <span className="absolute bottom-4 text-sm">Video unavailable</span>}
          </button>
        )}
      </div>
      <div className="p-3">
        <h2 className="line-clamp-2 text-sm font-semibold text-ink">{s.title}</h2>
        {s.description && <p className="mt-1 line-clamp-2 text-xs text-muted">{s.description}</p>}
        <p className="mt-2 text-xs text-faint">{Number(s.views).toLocaleString()} views · ♥ {Number(s.likes).toLocaleString()}</p>
      </div>
    </li>
  );
}

export function ShortsGrid({ shorts }: { shorts: Rec[] }) {
  if (shorts.length === 0) return <EmptyState title="No shorts yet" hint="New match highlights will appear here." />;
  return <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{shorts.map((s) => <ShortCard key={s._id} s={s} />)}</ul>;
}
