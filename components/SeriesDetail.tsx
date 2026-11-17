"use client";

import { useMemo, useState } from "react";
import type { MatchSummary, Rec } from "@/lib/types";
import { formatDate, formatLabel } from "@/lib/format";
import { MatchCard } from "./MatchCard";
import { PointsTable } from "./PointsTable";
import { EmptyState, FormatBadge, TabPanel, Tabs } from "./ui";

type Tab = "matches" | "points";

export function SeriesDetail({ series, matches, points }: { series: Rec; matches: MatchSummary[]; points: Rec[] }) {
  const showPoints = series.hasPoints || points.length > 0;
  const [tab, setTab] = useState<Tab>("matches");

  const buckets = useMemo(
    () => [
      { title: "Live", items: matches.filter((m) => m.status === "Live") },
      { title: "Upcoming", items: matches.filter((m) => m.status === "Scheduled").sort((a, b) => +new Date(a.time || 0) - +new Date(b.time || 0)) },
      { title: "Results", items: matches.filter((m) => m.status === "Completed" || m.status === "Abandoned" || m.status === "Cancelled") },
    ].filter((b) => b.items.length > 0),
    [matches],
  );

  return (
    <div className="space-y-5">
      <header className="card p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{series.name}</h1>
          {series.activeFormat && <FormatBadge>{formatLabel(series.activeFormat)}</FormatBadge>}
        </div>
        <p className="mt-1 text-sm text-muted">
          {formatDate(series.startDate, true)}
          {series.endDate ? ` – ${formatDate(series.endDate, true)}` : ""}
          {series.totalTeams ? ` · ${series.totalTeams} teams` : ""}
        </p>
      </header>

      <Tabs
        label="Series sections"
        value={tab}
        onChange={setTab}
        tabs={[{ value: "matches", label: "Matches" }, ...(showPoints ? [{ value: "points" as Tab, label: "Points table" }] : [])]}
      />
      <TabPanel id={tab}>
        {tab === "matches" ? (
          buckets.length === 0 ? (
            <EmptyState title="No fixtures yet" hint="Matches will be listed here once they are scheduled." />
          ) : (
            <div className="space-y-6">
              {buckets.map((b) => (
                <section key={b.title} aria-label={b.title}>
                  <h2 className="mb-3 text-base font-semibold text-ink">{b.title}</h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {b.items.map((m) => (
                      <MatchCard key={m.id} match={m} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )
        ) : (
          <PointsTable entries={points} />
        )}
      </TabPanel>
    </div>
  );
}
