"use client";

import { useEffect, useState } from "react";
import { api, unwrap } from "@/lib/api";
import type { Rec } from "@/lib/types";
import { fixed } from "@/lib/format";
import { EmptyState, ErrorState, Pills, Skeleton, Tabs, TabPanel, TeamLogo } from "./ui";

type Kind = "team" | "batting" | "bowling" | "all-rounder";

const KINDS: { value: Kind; label: string }[] = [
  { value: "team", label: "Teams" },
  { value: "batting", label: "Batting" },
  { value: "bowling", label: "Bowling" },
  { value: "all-rounder", label: "All-rounders" },
];

const GENDERS = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
];

const FORMATS = [
  { value: "test", label: "Test" },
  { value: "odi", label: "ODI" },
  { value: "t20", label: "T20I" },
];

export function Rankings() {
  const [kind, setKind] = useState<Kind>("team");
  const [gender, setGender] = useState("men");
  const [format, setFormat] = useState("odi");
  const [nonce, setNonce] = useState(0);
  const [result, setResult] = useState<{ key: string; rows: Rec[]; error: string | null } | null>(null);

  const key = `${kind}|${gender}|${format}|${nonce}`;
  const loading = result?.key !== key;
  const rows = result?.key === key ? result.rows : [];
  const error = result?.key === key ? result.error : null;

  useEffect(() => {
    const ctrl = new AbortController();
    api("/app/rankings", {
      signal: ctrl.signal,
      query: { type: kind === "team" ? "team" : "player", role: kind === "team" ? undefined : kind, gender, format, limit: 50 },
    })
      .then((res) => {
        const data = unwrap<Rec>(res);
        setResult({ key, rows: (Array.isArray(data) ? data : data?.result || data?.items || []) as Rec[], error: null });
      })
      .catch((e) => {
        if ((e as Error).name !== "AbortError") setResult({ key, rows: [], error: (e as Error).message });
      });
    return () => ctrl.abort();
  }, [key, kind, gender, format]);

  const isTeam = kind === "team";

  return (
    <div className="space-y-4">
      <Tabs label="Ranking category" value={kind} onChange={setKind} tabs={KINDS} />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Pills label="Format" value={format} onChange={setFormat} options={FORMATS} />
        <Pills label="Gender" value={gender} onChange={setGender} options={GENDERS} />
      </div>

      <TabPanel id={kind}>
        {loading ? (
          <div className="space-y-2" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => setNonce((n) => n + 1)} />
        ) : rows.length === 0 ? (
          <EmptyState title="No rankings available" hint="Rankings for this selection haven’t been published yet." />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[480px] text-left">
              <caption className="sr-only">{isTeam ? "Team rankings" : "Player rankings"}</caption>
              <thead className="bg-surface2">
                <tr>
                  <th scope="col" className="w-14 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">#</th>
                  <th scope="col" className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">{isTeam ? "Team" : "Player"}</th>
                  {isTeam && <th scope="col" className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-muted">Matches</th>}
                  {isTeam && <th scope="col" className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-muted">Points</th>}
                  <th scope="col" className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-muted">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => {
                  const name = isTeam ? r.teamName || r.name : r.name;
                  const delta = r.previousRank ? r.previousRank - r.rank : 0;
                  return (
                    <tr key={r._id || `${r.rank}-${name}`}>
                      <td className="px-4 py-3 num text-sm font-semibold text-ink">
                        {r.rank}
                        {delta !== 0 && (
                          <span className={`ml-1 text-[11px] ${delta > 0 ? "text-accent" : "text-live"}`} aria-label={delta > 0 ? `up ${delta}` : `down ${-delta}`}>
                            {delta > 0 ? "▲" : "▼"}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2.5">
                          <TeamLogo name={name || "?"} size={28} />
                          <div>
                            <p className="text-sm font-medium text-ink">{name}</p>
                            {!isTeam && r.country && <p className="text-xs text-muted">{r.country}</p>}
                          </div>
                        </div>
                      </td>
                      {isTeam && <td className="px-3 py-3 text-right num text-sm text-muted">{r.matchesPlayed ?? "–"}</td>}
                      {isTeam && <td className="px-3 py-3 text-right num text-sm text-muted">{r.points ?? "–"}</td>}
                      <td className="px-4 py-3 text-right num text-sm font-semibold text-ink">{r.rating ? fixed(r.rating, 0) : r.points ?? "–"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </TabPanel>
    </div>
  );
}
