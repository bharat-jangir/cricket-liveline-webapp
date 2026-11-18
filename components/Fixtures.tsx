"use client";

import { useCallback, useEffect, useState } from "react";
import type { MatchSummary, Rec } from "@/lib/types";
import { api, unwrap } from "@/lib/api";
import { MatchCard } from "./MatchCard";
import { EmptyState, ErrorState, Skeleton, Tabs, TabPanel } from "./ui";

type Dir = "future" | "past";
const PAGE = 20;

function dayKey(d?: string) {
  if (!d) return "Date to be announced";
  const date = new Date(d);
  return isNaN(date.getTime()) ? "Date to be announced" : date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

/** Date-grouped fixtures list with "load more" (the mobile Fixtures tab: upcoming first, results behind a toggle). */
export function Fixtures() {
  const [dir, setDir] = useState<Dir>("future");
  const [state, setState] = useState<Record<Dir, { items: MatchSummary[]; page: number; more: boolean; loading: boolean; error: string | null; loaded: boolean }>>({
    future: { items: [], page: 0, more: true, loading: false, error: null, loaded: false },
    past: { items: [], page: 0, more: true, loading: false, error: null, loaded: false },
  });

  const load = useCallback(async (d: Dir, page: number) => {
    setState((s) => ({ ...s, [d]: { ...s[d], loading: true, error: null } }));
    try {
      const query: Rec = { status: d === "future" ? "scheduled" : "completed", direction: d, page, limit: PAGE };
      const rows = unwrap<MatchSummary[]>(await api("/app/matches", { query })) || [];
      setState((s) => {
        const seen = new Set(s[d].items.map((m) => m.id));
        return { ...s, [d]: { items: [...s[d].items, ...rows.filter((m) => !seen.has(m.id))], page, more: rows.length >= PAGE, loading: false, error: null, loaded: true } };
      });
    } catch (e) {
      setState((s) => ({ ...s, [d]: { ...s[d], loading: false, error: (e as Error).message, loaded: true } }));
    }
  }, []);

  useEffect(() => {
    if (!state[dir].loaded && !state[dir].loading) load(dir, 1);
  }, [dir, state, load]);

  const cur = state[dir];
  const groups = cur.items.reduce<Record<string, MatchSummary[]>>((acc, m) => {
    (acc[dayKey(m.time)] ||= []).push(m);
    return acc;
  }, {});

  return (
    <div>
      <Tabs label="Fixtures range" value={dir} onChange={setDir} tabs={[{ value: "future", label: "Upcoming" }, { value: "past", label: "Past results" }]} />
      <TabPanel id={dir}>
        {cur.loading && cur.items.length === 0 ? (
          <div className="space-y-3" aria-busy="true">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div>
        ) : cur.error && cur.items.length === 0 ? (
          <ErrorState message={cur.error} onRetry={() => load(dir, 1)} />
        ) : cur.items.length === 0 ? (
          <EmptyState title={dir === "future" ? "No upcoming fixtures" : "No past results"} hint="Check back soon." />
        ) : (
          <div className="space-y-8">
            {Object.entries(groups).map(([day, items]) => (
              <section key={day} aria-label={day}>
                <h2 className="mb-3 text-sm font-semibold text-muted">{day}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((m) => <MatchCard key={m.id} match={m} />)}
                </div>
              </section>
            ))}
            {cur.more && (
              <div className="text-center">
                <button type="button" disabled={cur.loading} onClick={() => load(dir, cur.page + 1)} className="rounded-lg border border-line bg-surface px-5 py-2 text-sm font-medium text-ink hover:bg-surface2 disabled:opacity-60">
                  {cur.loading ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </div>
        )}
      </TabPanel>
    </div>
  );
}
