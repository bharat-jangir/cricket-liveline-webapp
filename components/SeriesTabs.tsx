"use client";

import Link from "next/link";
import { useState } from "react";
import type { Rec } from "@/lib/types";
import { idOf, playerName, teamName } from "@/lib/format";
import { useRemote } from "./match/hooks";
import { EmptyState, ErrorState, Pills, Skeleton, TeamLogo } from "./ui";

function Loading() {
  return (
    <div className="space-y-3" aria-busy="true">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

/** Teams in the series; selecting one shows its squad (captain / vice-captain / keeper tagged). */
export function TeamsTab({ seriesId, format }: { seriesId: string; format?: string }) {
  const { data, loading, error, reload } = useRemote<Rec[]>(`/app/series/${seriesId}/teams`);
  const [selected, setSelected] = useState<string | null>(null);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const seen = new Set<string>();
  const teams = (Array.isArray(data) ? data : []).filter((t) => {
    const id = idOf(t.teamId);
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  if (teams.length === 0) return <EmptyState title="No teams assigned yet" />;

  return (
    <div className="space-y-5">
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((t) => {
          const id = idOf(t.teamId);
          const active = selected === id;
          return (
            <li key={id}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(active ? null : id)}
                className={`card flex w-full items-center gap-3 p-4 text-left transition hover:border-accent/60 ${active ? "border-accent" : ""}`}
              >
                <TeamLogo name={teamName(t.teamId)} logo={t.teamId?.logo} size={40} />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{teamName(t.teamId)}</span>
                  <span className="text-xs text-muted">{active ? "Hide squad" : "View squad"}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {selected && <Squad seriesId={seriesId} teamId={selected} format={format} />}
    </div>
  );
}

function Squad({ seriesId, teamId, format }: { seriesId: string; teamId: string; format?: string }) {
  const { data, loading, error, reload } = useRemote<Rec>(`/app/series/${seriesId}/teams/${teamId}/squad`, { format });
  const [role, setRole] = useState("all");
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const players: Rec[] = data?.squadPlayers || [];
  if (players.length === 0) return <EmptyState title="Squad not announced yet" />;
  const group = (r: string) => (r === "batsman" || r === "wicket-keeper" ? "bat" : r === "bowler" ? "bowl" : "ar");
  const shown = players.filter((p) => role === "all" || group(String(p.role || p.playerId?.role)) === role);

  return (
    <section className="card overflow-hidden" aria-label="Squad">
      <div className="border-b border-line bg-surface2 px-4 py-3">
        <h3 className="mb-2 text-sm font-semibold text-ink">{teamName(data?.teamId)} squad</h3>
        <Pills label="Role" value={role} onChange={setRole} options={[{ value: "all", label: "All" }, { value: "bat", label: "Batters" }, { value: "bowl", label: "Bowlers" }, { value: "ar", label: "All-rounders" }]} />
      </div>
      <ul className="divide-y divide-line">
        {shown.map((p) => (
          <li key={idOf(p.playerId)}>
            <Link href={`/players/${idOf(p.playerId)}`} className="flex items-center gap-2 px-4 py-2.5 hover:bg-surface2">
              <span className="text-sm text-ink">{playerName(p.playerId)}</span>
              {p.isCaptain && <span className="rounded bg-accentsoft px-1.5 text-[10px] font-semibold text-accent">C</span>}
              {p.isViceCaptain && <span className="rounded bg-accentsoft px-1.5 text-[10px] font-semibold text-accent">VC</span>}
              {p.isWicketKeeper && <span className="rounded bg-accentsoft px-1.5 text-[10px] font-semibold text-accent">WK</span>}
              <span className="ml-auto text-xs capitalize text-muted">{String(p.role || p.playerId?.role || "").replace(/[-_]/g, " ")}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Series leaderboards: Batting / Bowling / Fielding. */
export function StatsTab({ seriesId }: { seriesId: string }) {
  const { data, loading, error, reload } = useRemote<Rec>(`/app/series/${seriesId}/leaders`);
  const [cat, setCat] = useState<"Batting" | "Bowling" | "Fielding">("Batting");
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const rows: Rec[] = data?.[cat] || [];
  const titles = Array.from(new Set(rows.map((r) => r.title)));

  return (
    <div className="space-y-5">
      <Pills label="Stats category" value={cat} onChange={setCat} options={(["Batting", "Bowling", "Fielding"] as const).map((c) => ({ value: c, label: c }))} />
      {rows.length === 0 ? (
        <EmptyState title="No stats yet" hint="Leaderboards appear once matches have been played." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {titles.map((t) => (
            <section key={t} className="card overflow-hidden" aria-label={t}>
              <h3 className="border-b border-line bg-surface2 px-4 py-2.5 text-sm font-semibold text-ink">{t}</h3>
              <ol className="divide-y divide-line">
                {rows.filter((r) => r.title === t).map((r) => (
                  <li key={r.id}>
                    <Link href={`/players/${r.playerId}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface2">
                      <span className="w-5 text-xs text-muted num">{r.rank}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-ink">{r.player}</span>
                        {r.team && <span className="text-xs text-muted">{r.team}</span>}
                      </span>
                      <span className="num text-right">
                        <span className="text-lg font-semibold text-accent">{r.value}</span>
                        <span className="ml-1 text-[11px] text-muted">{r.metric}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export function VenuesTab({ seriesId }: { seriesId: string }) {
  const { data, loading, error, reload } = useRemote<Rec[]>(`/app/series/${seriesId}/venues`);
  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const venues = (Array.isArray(data) ? data : []).map((v) => v.venueId || v).filter((v) => v && typeof v === "object");
  if (venues.length === 0) return <EmptyState title="No venues listed" />;
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {venues.map((v) => (
        <li key={idOf(v)}>
          <Link href={`/venues/${idOf(v)}`} className="card flex items-center gap-3 p-4 hover:border-accent/60">
            <span aria-hidden className="grid size-10 place-items-center rounded-full bg-surface2 text-lg">🏟️</span>
            <span className="min-w-0">
              <span className="block truncate font-medium text-ink">{v.name}</span>
              <span className="text-xs text-muted">{[v.city, v.country].filter(Boolean).join(", ")}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
