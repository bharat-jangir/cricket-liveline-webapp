"use client";

import type { Rec } from "@/lib/types";
import { fixed, idOf, playerName } from "@/lib/format";
import { useRemote } from "./hooks";
import { BallChip } from "./BallChip";
import { EmptyState, Skeleton } from "../ui";

const th = "px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-muted";
const td = "px-3 py-2.5 text-right num text-sm";

function groupOvers(recent: Rec[]) {
  const groups: { over: number; balls: Rec[]; summary?: Rec }[] = [];
  for (const item of recent || []) {
    if (item.type === "over_start") groups.push({ over: item.overNumber, balls: [] });
    else if (item.type === "ball") {
      let g = groups[groups.length - 1];
      if (!g || g.over !== item.overNumber) {
        g = { over: item.overNumber, balls: [] };
        groups.push(g);
      }
      g.balls.push(item);
    } else if (item.type === "over_summary") {
      const g = [...groups].reverse().find((x) => x.over === item.overNumber);
      if (g) g.summary = item;
    }
  }
  return groups.filter((g) => g.balls.length > 0).slice(-3).reverse();
}

export function LiveTab({ matchId, liveStatus, refreshKey, hundred }: { matchId: string; liveStatus: Rec | null; refreshKey: unknown; hundred: boolean }) {
  const inningNo = liveStatus?.currentInning || 1;
  const { data: sc, loading } = useRemote<Rec>(`/app/matches/${matchId}/scorecard/${inningNo}`, undefined, refreshKey);

  const strikerId = idOf(liveStatus?.currentStrikerId);
  const nonStrikerId = idOf(liveStatus?.currentNonStrikerId);
  const bowlerId = idOf(liveStatus?.currentBowlerId);

  const find = (rows: Rec[] | undefined, id: string) => rows?.find((r) => idOf(r.playerId) === id);
  const batters = [find(sc?.batting, strikerId), find(sc?.batting, nonStrikerId)]
    .map((r, i) => (r ? { ...r, onStrike: i === 0 } : null))
    .filter(Boolean) as Rec[];
  const bowler = find(sc?.bowling, bowlerId);
  const overs = groupOvers(liveStatus?.recentBalls || []);
  const lastWicket = liveStatus?.lastWicket;

  if (!liveStatus) return <EmptyState title="Live data isn’t available yet" hint="Scores will appear here as soon as play begins." />;

  return (
    <div className="space-y-5">
      {liveStatus.comment2 && <p className="card px-4 py-3 text-sm font-medium text-ink">{liveStatus.comment2}</p>}

      <div className="card overflow-hidden">
        <table className="w-full table-fixed text-left">
          <caption className="sr-only">Batters at the crease</caption>
          <thead className="bg-surface2">
            <tr>
              <th scope="col" className="w-[40%] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Batters</th>
              <th scope="col" className={th}>R</th>
              <th scope="col" className={th}>B</th>
              <th scope="col" className={th}>4s</th>
              <th scope="col" className={th}>6s</th>
              <th scope="col" className={th}>SR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading && !sc ? (
              <tr><td colSpan={6} className="px-3 py-4"><Skeleton className="h-6 w-full" /></td></tr>
            ) : batters.length === 0 ? (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-sm text-muted">Waiting for batters</td></tr>
            ) : (
              batters.map((r) => (
                <tr key={idOf(r.playerId)}>
                  <td className="px-3 py-2.5 text-sm font-semibold text-ink">
                    {playerName(r.playerId)}
                    {r.onStrike && <span className="ml-1 text-accent" aria-label="on strike">*</span>}
                  </td>
                  <td className={`${td} font-semibold text-ink`}>{r.runs ?? 0}</td>
                  <td className={td}>{r.balls ?? 0}</td>
                  <td className={td}>{r.fours ?? 0}</td>
                  <td className={td}>{r.sixes ?? 0}</td>
                  <td className={`${td} text-muted`}>{(r.balls || 0) > 0 ? fixed(r.strikeRate ?? (r.runs / r.balls) * 100) : "–"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <table className="w-full table-fixed text-left border-t border-line">
          <caption className="sr-only">Current bowler</caption>
          <thead className="bg-surface2">
            <tr>
              <th scope="col" className="w-[40%] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Bowler</th>
              <th scope="col" className={th}>{hundred ? "B" : "O"}</th>
              <th scope="col" className={th}>M</th>
              <th scope="col" className={th}>R</th>
              <th scope="col" className={th}>W</th>
              <th scope="col" className={th}>Econ</th>
            </tr>
          </thead>
          <tbody>
            {bowler ? (
              <tr>
                <td className="px-3 py-2.5 text-sm font-semibold text-ink">{playerName(bowler.playerId)}</td>
                <td className={td}>{hundred ? bowler.balls ?? 0 : fixed(bowler.overs, 1)}</td>
                <td className={td}>{bowler.maidens ?? 0}</td>
                <td className={td}>{bowler.runs ?? 0}</td>
                <td className={`${td} font-semibold text-ink`}>{bowler.wickets ?? 0}</td>
                <td className={`${td} text-muted`}>{fixed(bowler.economy)}</td>
              </tr>
            ) : (
              <tr><td colSpan={6} className="px-3 py-4 text-center text-sm text-muted">Waiting for bowler</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card p-4">
        <h3 className="mb-3 text-sm font-semibold text-ink">{hundred ? "Recent sets" : "Recent overs"}</h3>
        {overs.length === 0 ? (
          <p className="text-sm text-muted">No balls bowled yet.</p>
        ) : (
          <ul className="space-y-3">
            {overs.map((o) => (
              <li key={o.over} className="flex flex-wrap items-center gap-2">
                <span className="w-14 shrink-0 text-xs font-medium text-muted">{hundred ? "Set" : "Over"} {o.over}</span>
                <span className="flex flex-wrap gap-1.5">
                  {o.balls.map((b, i) => (
                    <BallChip key={b.ballId || i} ball={b} />
                  ))}
                </span>
                {o.summary && (
                  <span className="ml-auto num text-xs text-muted">
                    = <span className="font-semibold text-ink">{o.summary.runs}</span> run{o.summary.runs === 1 ? "" : "s"}
                    {o.summary.wickets > 0 && <>, {o.summary.wickets} wkt</>}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {lastWicket && (lastWicket.name || lastWicket.playerName) && (
        <div className="card px-4 py-3 text-sm">
          <span className="text-muted">Last wicket: </span>
          <span className="font-medium text-ink">{lastWicket.name || lastWicket.playerName}</span>
          <span className="text-muted num"> {lastWicket.tr || `${lastWicket.runs}(${lastWicket.balls})`}</span>
          {lastWicket.dismissal && <span className="text-muted"> · {String(lastWicket.dismissal).replace(/_/g, " ")}</span>}
        </div>
      )}
    </div>
  );
}
