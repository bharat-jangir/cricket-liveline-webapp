"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, unwrap } from "@/lib/api";
import type { Rec } from "@/lib/types";
import { BallChip } from "./BallChip";
import { EmptyState, ErrorState, Pills, Skeleton } from "../ui";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "wicket", label: "Wickets" },
  { value: "four", label: "Fours" },
  { value: "six", label: "Sixes" },
  { value: "over", label: "Overs" },
];

const keyOf = (c: Rec) => String(c.ballId || c._id || `${c.inningNumber}-${c.overNumber}-${c.ballLabel}-${c.timestamp}`);

export function CommentaryTab({ matchId, refreshKey, resetKey, hundred }: { matchId: string; refreshKey: unknown; resetKey: unknown; hundred: boolean }) {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState<Rec[]>([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filterRef = useRef(filter);

  const fetchPage = useCallback(
    async (p: number, f: string) => {
      const res = await api(`/app/matches/${matchId}/commentary`, { query: { page: p, limit: 30, type: f === "all" ? undefined : f } });
      const data = unwrap<Rec[] | Rec>(res);
      return (Array.isArray(data) ? data : (data as Rec)?.result || []) as Rec[];
    },
    [matchId],
  );

  // Hard load: first mount, filter change, undo (resetKey)
  useEffect(() => {
    filterRef.current = filter;
    let cancelled = false;
    setLoading(true);
    fetchPage(1, filter)
      .then((rows) => {
        if (cancelled) return;
        setItems(rows);
        setPage(1);
        setMore(rows.length >= 30);
        setError(null);
      })
      .catch((e) => !cancelled && setError((e as Error).message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [filter, resetKey, fetchPage]);

  // Soft refresh on new balls: prepend only unseen entries so older pages stay put
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    fetchPage(1, filterRef.current)
      .then((rows) =>
        setItems((prev) => {
          const seen = new Set(prev.map(keyOf));
          const fresh = rows.filter((r) => !seen.has(keyOf(r)));
          return fresh.length ? [...fresh, ...prev] : prev;
        }),
      )
      .catch(() => undefined);
  }, [refreshKey, fetchPage]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const rows = await fetchPage(page + 1, filter);
      setItems((prev) => {
        const seen = new Set(prev.map(keyOf));
        return [...prev, ...rows.filter((r) => !seen.has(keyOf(r)))];
      });
      setPage((p) => p + 1);
      setMore(rows.length >= 30);
    } catch {
      /* keep existing list */
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div>
      <Pills label="Commentary filter" value={filter} onChange={setFilter} options={FILTERS} />
      <div className="mt-4">
        {loading ? (
          <div className="space-y-3" aria-busy="true">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => setFilter((f) => f)} />
        ) : items.length === 0 ? (
          <EmptyState title="No commentary yet" hint="Ball-by-ball commentary appears here once play starts." />
        ) : (
          <ol className="card divide-y divide-line">
            {items.map((c) =>
              c.type === "over_end" ? (
                <li key={keyOf(c)} className="bg-surface2/60 px-4 py-3 first:rounded-t-[14px]">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    End of {hundred ? "set" : "over"} {c.overNumber}
                    {c.runs !== undefined && <span className="num normal-case"> · {c.runs} runs{c.isMaiden ? " · maiden" : ""}</span>}
                  </p>
                  {c.commentary && <p className="mt-1 text-sm text-ink">{c.commentary}</p>}
                </li>
              ) : (
                <li key={keyOf(c)} className="flex gap-3 px-4 py-3">
                  <div className="w-12 shrink-0 text-center">
                    <BallChip ball={c} />
                    {c.overNumber !== undefined && <p className="mt-1 num text-[11px] text-faint">{hundred ? "S" : "Ov"} {c.overNumber}</p>}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm leading-relaxed ${c.isWicket ? "font-medium text-wicket" : "text-ink"}`}>
                      {c.commentary || [c.bowlerName, c.batsmanName].filter(Boolean).join(" to ")}
                    </p>
                  </div>
                </li>
              ),
            )}
          </ol>
        )}
        {more && !loading && (
          <div className="mt-4 text-center">
            <button type="button" onClick={loadMore} disabled={loadingMore} className="rounded-lg border border-line bg-surface px-5 py-2 text-sm font-medium text-ink hover:bg-surface2 disabled:opacity-60">
              {loadingMore ? "Loading…" : "Load older commentary"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
