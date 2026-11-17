import type { Rec } from "@/lib/types";
import { formatDate, formatLabel, formatTime, oversLabel, startsIn, teamCode, teamName, idOf, fixed } from "@/lib/format";
import { ballsToOvers, ballsPerOverOf, chaseLine, inningScores, isHundred, type InningScore } from "@/lib/match";
import { FormatBadge, LiveBadge, TeamLogo } from "../ui";

function TeamScore({ name, logo, scores, battingNow, hundred, bpo, align }: { name: string; logo?: string; scores: InningScore[]; battingNow: boolean; hundred: boolean; bpo: number; align: "left" | "right" }) {
  const latest = scores[scores.length - 1];
  return (
    <div className={`flex-1 min-w-0 flex flex-col gap-2 ${align === "right" ? "items-end text-right" : "items-start"}`}>
      <div className={`flex items-center gap-2.5 ${align === "right" ? "flex-row-reverse" : ""}`}>
        <TeamLogo name={name} logo={logo} size={40} />
        <p className={`truncate text-base sm:text-lg ${battingNow ? "font-semibold text-ink" : "font-medium text-muted"}`}>{name}</p>
      </div>
      {latest ? (
        <p className="num">
          <span className={`text-2xl sm:text-3xl font-semibold ${battingNow ? "text-ink" : "text-muted"}`}>
            {scores.map((s) => `${s.runs}/${s.wickets}`).join(" & ")}
          </span>
          <span className="ml-2 text-sm text-muted">{oversLabel(ballsToOvers(latest.balls, bpo, hundred), hundred ? "HUNDRED" : "T20")}</span>
        </p>
      ) : (
        <p className="text-sm text-faint">Yet to bat</p>
      )}
    </div>
  );
}

export function ScoreHeader({ match, liveStatus }: { match: Rec; liveStatus: Rec | null }) {
  const status: string = liveStatus?.matchStatus || match.status;
  const live = status === "live";
  const completed = status === "completed";
  const hundred = isHundred(match, liveStatus);
  const bpo = ballsPerOverOf(match, liveStatus);

  const teamA = match.teamAId as Rec;
  const teamB = match.teamBId as Rec;
  const scores = inningScores(liveStatus);
  const byTeam = (id: string) => scores.filter((s) => s.teamId === id && s.type !== "super_over");
  const currentInning = scores.find((s) => s.number === liveStatus?.currentInning);
  const battingId = live ? currentInning?.teamId : "";

  const chase = live ? chaseLine(liveStatus) : null;
  const headline = match.result?.resultText || (completed ? "Match completed" : chase || liveStatus?.comment2 || match.toss?.tossText || (status === "scheduled" ? startsIn(match.matchTime || match.matchDate) : ""));

  const superOvers = scores.filter((s) => s.type === "super_over");

  return (
    <section className="card overflow-hidden" aria-label="Match score">
      <div className="bg-brand text-white/90 px-5 py-2.5 flex items-center gap-2 text-xs">
        <span className="truncate">{teamName(match.seriesId, "Match")}</span>
        <span className="ml-auto flex items-center gap-2 shrink-0">
          <FormatBadge>{formatLabel(match.matchFormat)}</FormatBadge>
          {live ? <LiveBadge /> : completed ? <span className="text-white/70">Completed</span> : null}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <h1 className="sr-only">
          {teamName(teamA)} vs {teamName(teamB)}
        </h1>
        <div className="flex items-start gap-4">
          <TeamScore name={teamName(teamA)} logo={teamA?.logo} scores={byTeam(idOf(teamA))} battingNow={battingId === idOf(teamA)} hundred={hundred} bpo={bpo} align="left" />
          <span className="pt-3 text-xs font-semibold text-faint">VS</span>
          <TeamScore name={teamName(teamB)} logo={teamB?.logo} scores={byTeam(idOf(teamB))} battingNow={battingId === idOf(teamB)} hundred={hundred} bpo={bpo} align="right" />
        </div>

        {superOvers.length > 0 && (
          <p className="mt-3 text-sm text-muted num">
            Super Over: {superOvers.map((s) => `${teamCode({ code: s.teamCode })} ${s.runs}/${s.wickets}`).join(" • ")}
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line pt-4 text-sm">
          <p className={`font-medium ${completed ? "text-accent" : live ? "text-live" : "text-muted"}`}>{headline || "—"}</p>
          {live && (liveStatus?.runRate ?? 0) > 0 && (
            <p className="text-muted num">
              CRR <span className="text-ink font-medium">{fixed(liveStatus?.runRate)}</span>
              {(liveStatus?.equation?.requiredRunRate ?? 0) > 0 && (
                <>
                  {" "}· RRR <span className="text-ink font-medium">{fixed(liveStatus?.equation?.requiredRunRate)}</span>
                </>
              )}
            </p>
          )}
          {status === "scheduled" && (
            <p className="text-muted">
              {formatDate(match.matchTime || match.matchDate)} · {formatTime(match.matchTime || match.matchDate)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
