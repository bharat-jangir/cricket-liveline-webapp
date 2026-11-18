"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { Rec } from "@/lib/types";
import { NEWS_CATEGORIES, categoryLabel } from "@/lib/format";
import { NewsCard } from "./NewsCard";
import { EmptyState, ErrorState, Pills, Skeleton } from "./ui";

export function NewsList({ initial, initialPagination }: { initial: Rec[]; initialPagination?: Rec }) {
  const [category, setCategory] = useState("all");
  const [items, setItems] = useState<Rec[]>(initial);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(!!initialPagination && initialPagination.page < initialPagination.totalPages);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const req = useRef(0);
  const first = useRef(true);

  const load = useCallback(async (p: number, cat: string) => {
    const id = ++req.current;
    if (p === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const data = (await api("/app/news", { query: { page: p, limit: 12, category: cat === "all" ? undefined : cat } })) as Rec;
      if (id !== req.current) return;
      setItems((prev) => (p === 1 ? data.result : [...prev, ...data.result]));
      setPage(p);
      setMore(!!data.pagination && data.pagination.page < data.pagination.totalPages);
      setError(null);
    } catch (e) {
      if (id === req.current) setError((e as Error).message);
    } finally {
      if (id === req.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    if (first.current) { first.current = false; return; } // server already rendered "all"
    load(1, category);
  }, [category, load]);

  return (
    <div className="space-y-5">
      <Pills label="Category" value={category} onChange={setCategory} options={[{ value: "all", label: "All" }, ...NEWS_CATEGORIES.map((c) => ({ value: c, label: categoryLabel(c) }))]} />
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64" />)}</div>
      ) : error && items.length === 0 ? (
        <ErrorState message={error} onRetry={() => load(1, category)} />
      ) : items.length === 0 ? (
        <EmptyState title="No articles yet" hint="Check back soon for match reports and analysis." />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{items.map((a) => <NewsCard key={a._id} article={a} />)}</div>
          {more && (
            <div className="text-center">
              <button type="button" disabled={loadingMore} onClick={() => load(page + 1, category)} className="rounded-lg border border-line bg-surface px-5 py-2 text-sm font-medium text-ink hover:bg-surface2 disabled:opacity-60">
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
