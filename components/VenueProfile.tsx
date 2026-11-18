"use client";

import type { Rec } from "@/lib/types";
import { useRemote } from "./match/hooks";
import { Skeleton } from "./ui";

const FORMAT_KEYS: [string, string][] = [["test", "Test"], ["odi", "ODI"], ["t20i", "T20I"], ["t20", "T20"], ["ipl", "League T20"]];

export function VenueProfile({ venue }: { venue: Rec }) {
  const { data: stats, loading } = useRemote<Rec>(`/app/venues/${venue._id}/stats`);
  const rows = FORMAT_KEYS.map(([k, label]) => ({ label, s: stats?.[k] as Rec | undefined })).filter((r) => r.s && (r.s.matches || r.s.highestTotal));
  return (
    <div className="space-y-6">
      <header className="card p-5">
        <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">{venue.name}</h1>
        <p className="mt-1 text-sm text-muted">{[venue.city, venue.state, venue.country].filter(Boolean).join(", ")}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          {[["Capacity", venue.capacity ? Number(venue.capacity).toLocaleString() : ""], ["Pitch", venue.pitchType], ["Suited for", venue.suitedFor], ["Ground size", venue.groundSize]].filter(([, v]) => v).map(([k, v]) => (
            <div key={String(k)}><dt className="text-muted">{k}</dt><dd className="font-medium capitalize text-ink">{String(v)}</dd></div>
          ))}
        </dl>
      </header>
      <section aria-label="Venue records">
        <h2 className="mb-3 text-base font-semibold text-ink">Records</h2>
        {loading ? <Skeleton className="h-32 w-full" /> : rows.length === 0 ? (
          <p className="card px-5 py-6 text-sm text-muted">No venue statistics recorded yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {rows.map(({ label, s }) => (
              <div key={label} className="card overflow-hidden">
                <h3 className="border-b border-line bg-surface2 px-4 py-2.5 text-sm font-semibold text-ink">{label}</h3>
                <dl className="divide-y divide-line text-sm">
                  {[["Matches", s!.matches], ["Highest total", s!.highestTotal], ["Lowest total", s!.lowestTotal], ["Highest chased", s!.highestChased], ["Lowest defended", s!.lowestDefended], ["Won batting first", s!.winBatFirst], ["Won bowling first", s!.winBowlFirst]].filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between px-4 py-2.5"><dt className="text-muted">{k}</dt><dd className="num font-medium text-ink">{String(v)}</dd></div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
