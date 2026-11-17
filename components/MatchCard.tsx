import Link from "next/link";
import type { MatchSummary, TeamSide } from "@/lib/types";
import { formatDate, formatTime, formatLabel, startsIn, oversLabel } from "@/lib/format";
import { FormatBadge, LiveBadge, TeamLogo } from "./ui";

function TeamRow({ team, format, batting, dim }: { team: TeamSide; format: string; batting: boolean; dim: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <TeamLogo name={team.name} size={30} />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-[15px] ${dim ? "text-muted" : "text-ink font-semibold"}`}>{team.name}</p>
      </div>
      {team.score ? (
        <p className="num text-right">
          <span className={`text-[15px] font-semibold ${dim ? "text-muted" : "text-ink"}`}>{team.score}</span>
          {team.overs && (
            <span className="ml-1.5 text-xs text-muted">
              {oversLabel(team.overs, format)}
              {batting && <span aria-label="batting" className="ml-1 text-accent">●</span>}
            </span>
          )}
        </p>
      ) : (
        <span className="text-xs text-faint">—</span>
      )}
    </div>
  );
}

export function MatchCard({ match }: { match: MatchSummary }) {
  const live = match.status === "Live";
  const done = match.status === "Completed";
  const upcoming = match.status === "Scheduled";
  const fmt = match.format;

  // Whoever is batting right now (for live), keep the other slightly muted
  const battingId = match.battingTeam;
  const t1Batting = live && !!battingId && (battingId === match.team1.id || battingId === match.team1.code);
  const t2Batting = live && !!battingId && (battingId === match.team2.id || battingId === match.team2.code);

  const footer = live
    ? match.result
    : done
      ? match.result
      : upcoming
        ? `${formatDate(match.time)}${match.time ? ` · ${formatTime(match.time)}` : ""}`
        : match.status;

  return (
    <Link
      href={`/match/${match.id}`}
      className="card block p-4 transition hover:-translate-y-0.5 hover:border-accent/60 focus-visible:-translate-y-0.5"
      aria-label={`${match.team1.name} vs ${match.team2.name}, ${match.status}`}
    >
      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="truncate">{match.series}</span>
        <span className="ml-auto flex items-center gap-2 shrink-0">
          <FormatBadge>{formatLabel(fmt)}</FormatBadge>
          {live ? <LiveBadge /> : upcoming ? <span className="text-faint">{startsIn(match.time)}</span> : null}
        </span>
      </div>

      <div className="mt-3 space-y-3">
        <TeamRow team={match.team1} format={fmt} batting={t1Batting} dim={false} />
        <TeamRow team={match.team2} format={fmt} batting={t2Batting} dim={false} />
      </div>

      <div className="mt-3 border-t border-line pt-3 text-[13px]">
        <p className={`truncate ${live ? "text-live font-medium" : done ? "text-accent font-medium" : "text-muted"}`}>{footer || "—"}</p>
        {match.venue && match.venue !== "Unknown Venue" && <p className="mt-0.5 truncate text-xs text-faint">{match.venue}</p>}
      </div>
    </Link>
  );
}
