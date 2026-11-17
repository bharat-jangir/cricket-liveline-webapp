import type { Rec } from "./types";
import { idOf, teamCode, teamName } from "./format";

export interface InningScore {
  number: number;
  runs: number;
  wickets: number;
  balls: number;
  type: string;
  teamId: string;
  teamName: string;
  teamCode: string;
  logo?: string;
}

export function inningScores(liveStatus: Rec | null): InningScore[] {
  const innings: Rec[] = liveStatus?.innings || [];
  return innings
    .map((i) => ({
      number: Number(i.inningNumber),
      runs: Number(i.totalRuns || 0),
      wickets: Number(i.totalWickets || 0),
      balls: Number(i.totalBalls || 0),
      type: i.type || "normal",
      teamId: idOf(i.battingTeamId),
      teamName: teamName(i.battingTeamId),
      teamCode: teamCode(i.battingTeamId),
      logo: typeof i.battingTeamId === "object" ? i.battingTeamId?.logo : undefined,
    }))
    .sort((a, b) => a.number - b.number);
}

export function ballsToOvers(balls: number, ballsPerOver = 6, hundred = false) {
  if (hundred) return String(balls);
  return `${Math.floor(balls / ballsPerOver)}.${balls % ballsPerOver}`;
}

export function isHundred(match: Rec | null, liveStatus?: Rec | null) {
  return String(liveStatus?.format || match?.matchFormat || "").toLowerCase() === "hundred";
}

export function ballsPerOverOf(match: Rec | null, liveStatus?: Rec | null) {
  return isHundred(match, liveStatus) ? 5 : Number(liveStatus?.ballsPerOver || match?.ballsPerOver || 6);
}

/** "Team need 34 runs in 18 balls" style line for the chasing side. */
export function chaseLine(liveStatus: Rec | null): string | null {
  const eq = liveStatus?.equation;
  if (!eq || !eq.target) return null;
  const batting = teamName(liveStatus?.innings?.find((i: Rec) => i.inningNumber === liveStatus.currentInning)?.battingTeamId, "Batting side");
  if (eq.runsNeeded <= 0) return `${batting} have reached the target of ${eq.target}`;
  return `${batting} need ${eq.runsNeeded} run${eq.runsNeeded === 1 ? "" : "s"} in ${eq.ballsRemaining} ball${eq.ballsRemaining === 1 ? "" : "s"}`;
}

export function dismissalText(row: Rec): string {
  if (!row.isOut) return row.isCurrent ? "batting" : "not out";
  if (row.dismissalText) return row.dismissalText;
  const t = String(row.dismissalType || "out").replace(/_/g, " ");
  const bowler = row.bowlerId && typeof row.bowlerId === "object" ? row.bowlerId.name || row.bowlerId.fullName : "";
  const fielder = row.fielderId && typeof row.fielderId === "object" ? row.fielderId.name || row.fielderId.fullName : "";
  switch (t) {
    case "bowled": return `b ${bowler}`.trim();
    case "caught": return `c ${fielder || "sub"} b ${bowler}`.trim();
    case "lbw": return `lbw b ${bowler}`.trim();
    case "stumped": return `st ${fielder} b ${bowler}`.trim();
    case "run out": return `run out${fielder ? ` (${fielder})` : ""}`;
    case "hit wicket": return `hit wicket b ${bowler}`.trim();
    default: return t;
  }
}
