"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MatchSummary, Rec } from "@/lib/types";
import { api, unwrap } from "@/lib/api";
import { useLiveSocket } from "@/lib/socket";
import { MatchCard } from "./MatchCard";
import { EmptyState, Pills, Tabs, TabPanel } from "./ui";

type Bucket = "live" | "upcoming" | "results";
export interface HomeData {
  live: MatchSummary[];
  upcoming: MatchSummary[];
  results: MatchSummary[];
}

const FORMATS = [
  { value: "ALL", label: "All" },
  { value: "T20", label: "T20" },
  { value: "T20I", label: "T20I" },
  { value: "ODI", label: "ODI" },
  { value: "TEST", label: "Test" },
  { value: "T10", label: "T10" },
  { value: "HUNDRED", label: "The Hundred" },
];

async function loadAll(): Promise<HomeData> {
  const get = async (query: Rec) => {
    try {
      const data = await api("/app/matches", { query });
      return (unwrap<MatchSummary[]>(data) || []) as MatchSummary[];
    } catch {
      return null;
    }
  };
  const [live, upcoming, results] = await Promise.all([
    get({ status: "live", limit: 30 }),
    get({ status: "scheduled", direction: "future", limit: 30 }),
    get({ status: "completed", direction: "past", limit: 30 }),
  ]);
  return { live: live || [], upcoming: upcoming || [], results: results || [] };
}

export function HomeMatches({ initial, failed }: { initial: HomeData; failed?: boolean }) {
  const [data, setData] = useState<HomeData>(initial);
  const [tab, setTab] = useState<Bucket>(initial.live.length ? "live" : initial.upcoming.length ? "upcoming" : "results");
  const [format, setFormat] = useState("ALL");
  const [stale, setStale] = useState(!!failed);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    const next = await loadAll();
    setData(next);
    setStale(false);
  }, []);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(refresh, 800);
  }, [refresh]);

  // Realtime: patch scores in place; refetch when a match changes bucket
  const connected = useLiveSocket("listing", {
    listing_update: (u: Rec) => {
      setData((prev) => {
        let moved = false;
        const patch = (m: MatchSummary): MatchSummary => {
          if (m.id !== u.matchId) return m;
          const apply = (side: MatchSummary["team1"]) => {
            const src = [u.teamA, u.teamB].find((t: Rec) => t?.teamId && t.teamId === side.id);
            return src && src.score && src.score !== "—/—" ? { ...side, score: src.score, overs: src.overs } : side;
          };
          if (u.status && u.status !== "live") moved = true;
          return { ...m, team1: apply(m.team1), team2: apply(m.team2), result: u.lastBallLabel ? m.result : m.result };
        };
        const live = prev.live.map(patch);
        const found = prev.live.some((m) => m.id === u.matchId);
        if (!found || moved) scheduleRefresh();
        return { ...prev, live };
      });
    },
  });

  // Fallback polling when the socket is down; gentle refresh otherwise
  useEffect(() => {
    const t = setInterval(refresh, connected ? 90_000 : 20_000);
    return () => clearInterval(t);
  }, [connected, refresh]);

  useEffect(() => () => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
  }, []);

  const filtered = useMemo(() => {
    const byFormat = (list: MatchSummary[]) => (format === "ALL" ? list : list.filter((m) => String(m.format).toUpperCase() === format));
    return { live: byFormat(data.live), upcoming: byFormat(data.upcoming), results: byFormat(data.results) };
  }, [data, format]);

  const list = tab === "live" ? filtered.live : tab === "upcoming" ? filtered.upcoming : filtered.results;
  const empty =
    tab === "live"
      ? { title: "No live matches right now", hint: "Check upcoming fixtures or browse recent results." }
      : tab === "upcoming"
        ? { title: "No upcoming matches", hint: "New fixtures appear here as soon as they are scheduled." }
        : { title: "No results yet", hint: "Completed matches will show up here." };

  return (
    <section aria-label="Matches">
      {stale && (
        <div role="status" className="mb-4 rounded-lg border border-line bg-surface2 px-4 py-2.5 text-sm text-muted flex items-center justify-between gap-3">
          <span>Showing saved data — couldn’t reach the live service.</span>
          <button type="button" onClick={refresh} className="font-medium text-ink underline">Retry</button>
        </div>
      )}
      <Tabs
        label="Match status"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "live", label: "Live", badge: filtered.live.length > 0 ? <span className="rounded-full bg-live px-1.5 text-[11px] font-semibold text-white">{filtered.live.length}</span> : undefined },
          { value: "upcoming", label: "Upcoming" },
          { value: "results", label: "Results" },
        ]}
      />
      <div className="mt-4">
        <Pills label="Format filter" value={format} onChange={setFormat} options={FORMATS} />
      </div>
      <TabPanel id={tab}>
        {list.length === 0 ? (
          <EmptyState {...empty} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {list.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </TabPanel>
    </section>
  );
}
