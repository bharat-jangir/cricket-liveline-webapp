"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, unwrap } from "@/lib/api";
import type { Rec } from "@/lib/types";
import { idOf, teamName } from "@/lib/format";
import { EmptyState, ErrorState, Skeleton } from "./ui";

type Results = { matches: Rec[]; series: Rec[]; players: Rec[]; venues: Rec[] };

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section aria-label={title}><h2 className="mb-2 text-sm font-semibold text-muted">{title}</h2><ul className="card divide-y divide-line">{children}</ul></section>
  );
}
function Row({ href, title, sub }: { href: string; title: string; sub?: string }) {
  return (
    <li><Link href={href} className="block px-4 py-3 hover:bg-surface2"><span className="block truncate text-sm font-medium text-ink">{title}</span>{sub && <span className="text-xs text-muted">{sub}</span>}</Link></li>
  );
}

export function SearchResults({ q }: { q: string }) {
  const [state, setState] = useState<{ q: string; data: Results | null; error: string | null } | null>(null);
  useEffect(() => {
    if (q.length < 2) return;
    let cancelled = false;
    api("/app/search", { query: { q } })
      .then((res) => !cancelled && setState({ q, data: unwrap<Results>(res), error: null }))
      .catch((e) => !cancelled && setState({ q, data: null, error: (e as Error).message }));
    return () => { cancelled = true; };
  }, [q]);

  if (q.length < 2) return <EmptyState title="Type at least 2 characters" hint="Search matches, series, players and venues." />;
  if (!state || state.q !== q) return <div className="space-y-3" aria-busy="true"><Skeleton className="h-14" /><Skeleton className="h-14" /><Skeleton className="h-14" /></div>;
  if (state.error || !state.data) return <ErrorState message={state.error || undefined} />;

  const { matches = [], series = [], players = [], venues = [] } = state.data;
  if (matches.length + series.length + players.length + venues.length === 0) return <EmptyState title={`No results for “${q}”`} hint="Try a team, player or series name." />;

  return (
    <div className="space-y-6">
      {matches.length > 0 && <Group title="Matches">{matches.map((m) => <Row key={m.id || m._id} href={`/match/${m.id || m._id}`} title={`${m.team1?.name || teamName(m.teamAId)} vs ${m.team2?.name || teamName(m.teamBId)}`} sub={m.series || m.title} />)}</Group>}
      {series.length > 0 && <Group title="Series">{series.map((s) => <Row key={idOf(s)} href={`/series/${idOf(s)}`} title={s.name} sub={s.activeFormat} />)}</Group>}
      {players.length > 0 && <Group title="Players">{players.map((p) => <Row key={idOf(p)} href={`/players/${idOf(p)}`} title={p.name} sub={[p.country, String(p.role || "").replace(/-/g, " ")].filter(Boolean).join(" · ")} />)}</Group>}
      {venues.length > 0 && <Group title="Venues">{venues.map((v) => <Row key={idOf(v)} href={`/venues/${idOf(v)}`} title={v.name} sub={[v.city, v.country].filter(Boolean).join(", ")} />)}</Group>}
    </div>
  );
}
