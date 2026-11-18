"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { Rec } from "@/lib/types";
import { idOf } from "@/lib/format";
import { EmptyState, ErrorState, Pills, Skeleton, TeamLogo } from "./ui";

function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

/** Paged, searchable list used by Venues and Players. Race-safe: a newer query always wins. */
function usePagedList(path: string, query: Rec, deps: string) {
  const [items, setItems] = useState<Rec[]>([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const req = useRef(0);

  const load = async (p: number) => {
    const id = ++req.current;
    if (p === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const data = await api(path, { query: { ...query, page: p, limit: 24 } });
      const result = (data as Rec)?.result ?? [];
      const pagination = (data as Rec)?.pagination;
      if (id !== req.current) return;
      setItems((prev) => (p === 1 ? result : [...prev, ...result]));
      setPage(p);
      setMore(!!pagination && pagination.page < pagination.totalPages);
      setError(null);
    } catch (e) {
      if (id === req.current) setError((e as Error).message);
    } finally {
      if (id === req.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(1); }, [deps]);
  return { items, more, loading, loadingMore, error, loadMore: () => load(page + 1), retry: () => load(1) };
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="block sm:w-80">
      <span className="sr-only">{placeholder}</span>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-line bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-faint" />
    </label>
  );
}

function ListShell({ list, empty, children }: { list: ReturnType<typeof usePagedList>; empty: string; children: React.ReactNode }) {
  if (list.loading) return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}</div>;
  if (list.error && list.items.length === 0) return <ErrorState message={list.error} onRetry={list.retry} />;
  if (list.items.length === 0) return <EmptyState title={empty} />;
  return (
    <>
      {children}
      {list.more && (
        <div className="mt-6 text-center">
          <button type="button" disabled={list.loadingMore} onClick={list.loadMore} className="rounded-lg border border-line bg-surface px-5 py-2 text-sm font-medium text-ink hover:bg-surface2 disabled:opacity-60">
            {list.loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}

export function VenuesDirectory() {
  const [q, setQ] = useState("");
  const term = useDebounced(q.trim(), 350);
  const list = usePagedList("/app/venues", { search: term }, term);
  return (
    <div className="space-y-5">
      <SearchBox value={q} onChange={setQ} placeholder="Search venues or cities" />
      <ListShell list={list} empty="No venues found">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.items.map((v) => (
            <li key={idOf(v)}>
              <Link href={`/venues/${idOf(v)}`} className="card flex items-center gap-3 p-4 transition hover:border-accent/60">
                <span aria-hidden className="grid size-11 place-items-center rounded-full bg-surface2 text-xl">🏟️</span>
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{v.name}</span>
                  <span className="text-xs text-muted">{[v.city, v.country].filter(Boolean).join(", ")}</span>
                  {v.capacity ? <span className="ml-2 text-xs text-faint">{Number(v.capacity).toLocaleString()} seats</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </ListShell>
    </div>
  );
}

const ROLES = [
  { value: "", label: "All" },
  { value: "batsman", label: "Batsman" },
  { value: "bowler", label: "Bowler" },
  { value: "all-rounder", label: "All-Rounder" },
  { value: "wicket-keeper", label: "Keeper" },
];

export function PlayersDirectory() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const term = useDebounced(q.trim(), 350);
  const list = usePagedList("/app/players", { search: term, role }, `${term}|${role}`);
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBox value={q} onChange={setQ} placeholder="Search players or countries" />
        <div className="min-w-0 flex-1"><Pills label="Role" value={role} onChange={setRole} options={ROLES} /></div>
      </div>
      <ListShell list={list} empty="No players found">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.items.map((p) => (
            <li key={idOf(p)}>
              <Link href={`/players/${idOf(p)}`} className="card flex items-center gap-3 p-4 transition hover:border-accent/60">
                <TeamLogo name={p.name} logo={p.image} size={44} />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-ink">{p.name}</span>
                  <span className="text-xs text-muted">{p.country}</span>
                  <span className="ml-2 rounded-full bg-accentsoft px-2 py-0.5 text-[11px] font-medium capitalize text-accent">{String(p.role || "").replace(/-/g, " ")}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </ListShell>
    </div>
  );
}
