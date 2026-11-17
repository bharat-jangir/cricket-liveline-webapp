"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Rec } from "@/lib/types";
import { formatDate, formatLabel } from "@/lib/format";
import { EmptyState, FormatBadge, Pills } from "./ui";

export function seriesPhase(s: Rec): "ongoing" | "upcoming" | "completed" {
  const now = Date.now();
  const start = s.startDate ? new Date(s.startDate).getTime() : NaN;
  const end = s.endDate ? new Date(s.endDate).getTime() + 86_400_000 : NaN;
  if (!isNaN(start) && start > now) return "upcoming";
  if (!isNaN(end) && end < now) return "completed";
  return "ongoing";
}

const FORMATS = [
  { value: "ALL", label: "All formats" },
  { value: "TEST", label: "Test" },
  { value: "ODI", label: "ODI" },
  { value: "T20", label: "T20" },
  { value: "T10", label: "T10" },
  { value: "HUNDRED", label: "The Hundred" },
];

function norm(f?: string) {
  const u = String(f || "").toUpperCase();
  return u === "100B" ? "HUNDRED" : u;
}

export function SeriesList({ series }: { series: Rec[] }) {
  const [format, setFormat] = useState("ALL");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      series.filter(
        (s) =>
          (format === "ALL" || norm(s.activeFormat) === format) &&
          (!query || String(s.name).toLowerCase().includes(query.toLowerCase())),
      ),
    [series, format, query],
  );

  const groups = [
    { key: "ongoing", title: "Ongoing", items: filtered.filter((s) => seriesPhase(s) === "ongoing") },
    { key: "upcoming", title: "Upcoming", items: filtered.filter((s) => seriesPhase(s) === "upcoming") },
    { key: "completed", title: "Completed", items: filtered.filter((s) => seriesPhase(s) === "completed") },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative sm:w-72">
          <span className="sr-only">Search series</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search series"
            className="w-full rounded-lg border border-line bg-surface px-3.5 py-2 text-sm text-ink placeholder:text-faint"
          />
        </label>
        <div className="min-w-0 flex-1">
          <Pills label="Format filter" value={format} onChange={setFormat} options={FORMATS} />
        </div>
      </div>

      {groups.length === 0 ? (
        <EmptyState title="No series found" hint="Try a different format or search term." />
      ) : (
        groups.map((g) => (
          <section key={g.key} aria-label={g.title}>
            <h2 className="mb-3 text-base font-semibold text-ink">{g.title}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {g.items.map((s) => (
                <li key={s._id}>
                  <Link href={`/series/${s._id}`} className="card flex h-full items-center gap-3 p-4 transition hover:border-accent/60">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-ink">{s.name}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {formatDate(s.startDate)}
                        {s.endDate ? ` – ${formatDate(s.endDate)}` : ""}
                        {s.totalMatches ? ` · ${s.totalMatches} matches` : ""}
                      </p>
                    </div>
                    {s.activeFormat && <FormatBadge>{formatLabel(s.activeFormat)}</FormatBadge>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
