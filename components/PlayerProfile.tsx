"use client";

import { useState } from "react";
import type { Rec } from "@/lib/types";
import { formatDate, playerName } from "@/lib/format";
import { useRemote } from "./match/hooks";
import { ErrorState, Pills, Skeleton, TeamLogo } from "./ui";

const FORMATS = [
  { value: "test", label: "Test" },
  { value: "odi", label: "ODI" },
  { value: "t20i", label: "T20I" },
  { value: "t10", label: "T10" },
  { value: "hundred", label: "The Hundred" },
];

function Stat({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="card px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="num mt-1 text-xl font-semibold text-ink">{value ?? "–"}</p>
    </div>
  );
}

export function PlayerProfile({ player }: { player: Rec }) {
  const [format, setFormat] = useState("t20i");
  const { data: stats, loading, error, reload } = useRemote<Rec>(`/app/players/${player._id}/stats`, { format });
  const role = String(player.role || "");
  const bowlerOnly = role === "bowler";
  const bats = role !== "bowler" || Number(stats?.runs) > 0;
  const bowls = role === "bowler" || role === "all-rounder" || Number(stats?.wickets) > 0;

  return (
    <div className="space-y-6">
      <header className="card flex items-center gap-4 p-5">
        <TeamLogo name={playerName(player)} logo={player.image} size={72} />
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight text-ink sm:text-2xl">{playerName(player)}</h1>
          <p className="text-sm text-muted">{player.country}</p>
          <p className="mt-1 text-xs capitalize text-muted">
            {[role.replace(/-/g, " "), player.battingStyle && `${String(player.battingStyle).replace(/-/g, " ")} bat`, player.bowlingStyle || (player.bowlingArm && `${player.bowlingArm} arm`)].filter(Boolean).join(" · ")}
          </p>
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        {[
          ["Born", player.dob ? formatDate(player.dob, true) : ""],
          ["Birthplace", player.birthPlace],
          ["Jersey", player.jerseyNumber],
          ["Role", role.replace(/-/g, " ")],
        ].filter(([, v]) => v).map(([k, v]) => (
          <div key={String(k)}><dt className="text-muted">{k}</dt><dd className="font-medium capitalize text-ink">{String(v)}</dd></div>
        ))}
      </dl>

      <section aria-label="Career stats" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-ink">Career stats</h2>
          <Pills label="Format" value={format} onChange={setFormat} options={FORMATS} />
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Matches" value={stats?.matches} />
              {bats && <><Stat label="Runs" value={stats?.runs} /><Stat label="Average" value={stats?.battingAverage ?? stats?.average} /><Stat label="Strike rate" value={stats?.strikeRate} />
                <Stat label="High score" value={stats?.highScore} /><Stat label="100s" value={stats?.hundreds} /><Stat label="50s" value={stats?.fifties} /><Stat label="6s" value={stats?.sixes} /></>}
            </div>
            {bowls && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Wickets" value={stats?.wickets} />
                <Stat label="Bowling avg" value={stats?.bowlingAverage ?? (bowlerOnly ? stats?.average : undefined)} />
                <Stat label="Economy" value={stats?.economy} />
                <Stat label="Best bowling" value={stats?.bestBowling} />
                <Stat label="5 wickets" value={stats?.fiveWickets} />
              </div>
            )}
            {Number(stats?.matches) === 0 && <p className="text-sm text-muted">No recorded matches in this format yet.</p>}
          </>
        )}
      </section>
    </div>
  );
}
