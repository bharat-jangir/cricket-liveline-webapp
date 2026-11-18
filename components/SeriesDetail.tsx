"use client";

import { useMemo, useState } from "react";
import type { MatchSummary, Rec } from "@/lib/types";
import { formatDate, formatLabel } from "@/lib/format";
import { MatchCard } from "./MatchCard";
import { PointsTable } from "./PointsTable";
import { StatsTab, TeamsTab, VenuesTab } from "./SeriesTabs";
import { EmptyState, FormatBadge, TabPanel, Tabs } from "./ui";

type Tab = "overview" | "fixtures" | "teams" | "stats" | "venues" | "points";

function MatchGrid({ matches }: { matches: MatchSummary[] }) {
  const buckets = useMemo(
    () =>
      [
        { title: "Live", items: matches.filter((m) => m.status === "Live") },
        { title: "Upcoming", items: matches.filter((m) => m.status === "Scheduled").sort((a, b) => +new Date(a.time || 0) - +new Date(b.time || 0)) },
        { title: "Results", items: matches.filter((m) => ["Completed", "Abandoned", "Cancelled"].includes(m.status)) },
      ].filter((b) => b.items.length > 0),
    [matches],
  );
  if (buckets.length === 0) return <EmptyState title="No fixtures yet" hint="Matches will be listed here once they are scheduled." />;
  return (
    <div className="space-y-6">
      {buckets.map((b) => (
        <section key={b.title} aria-label={b.title}>
          <h2 className="mb-3 text-base font-semibold text-ink">{b.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {b.items.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

export function SeriesDetail({ series, matches, points }: { series: Rec; matches: MatchSummary[]; points: Rec[] }) {
  const showPoints = series.hasPoints || points.length > 0;
  const [tab, setTab] = useState<Tab>("overview");
  const featured = matches.filter((m) => m.status === "Live").concat(matches.filter((m) => m.status === "Scheduled")).slice(0, 3);

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
          {matches.length ? ` · ${matches.length} matches` : ""}
        </p>
      </header>

      <Tabs
        label="Series sections"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "overview", label: "Overview" },
          { value: "fixtures", label: "Fixtures" },
          { value: "teams", label: "Teams" },
          { value: "stats", label: "Stats" },
          { value: "venues", label: "Venues" },
          ...(showPoints ? [{ value: "points" as Tab, label: "Points table" }] : []),
        ]}
      />
      <TabPanel id={tab}>
        {tab === "overview" && (
          <div className="space-y-6">
            {series.description && <p className="card p-4 text-sm leading-relaxed text-muted">{series.description}</p>}
            <section aria-label="Featured matches">
              <h2 className="mb-3 text-base font-semibold text-ink">Featured matches</h2>
              {featured.length === 0 ? <p className="text-sm text-muted">No live or upcoming matches. See Fixtures for results.</p> : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{featured.map((m) => <MatchCard key={m.id} match={m} />)}</div>
              )}
            </section>
          </div>
        )}
        {tab === "fixtures" && <MatchGrid matches={matches} />}
        {tab === "teams" && <TeamsTab seriesId={series._id} format={series.activeFormat} />}
        {tab === "stats" && <StatsTab seriesId={series._id} />}
        {tab === "venues" && <VenuesTab seriesId={series._id} />}
        {tab === "points" && <PointsTable entries={points} />}
      </TabPanel>
    </div>
  );
}
