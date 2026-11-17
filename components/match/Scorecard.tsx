"use client";

import type { Rec } from "@/lib/types";
import { fixed, idOf, playerName } from "@/lib/format";
import { dismissalText } from "@/lib/match";
import { useRemote } from "./hooks";
import { ErrorState, Skeleton } from "../ui";

const th = "px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-muted";
const td = "px-3 py-2.5 text-right num text-sm";

export function InningScorecard({
  matchId,
  inningNumber,
  refreshKey,
  hundred,
  currentIds = [],
  matchDone,
}: {
  matchId: string;
  inningNumber: number;
  refreshKey: unknown;
  hundred: boolean;
  currentIds?: string[];
  matchDone: boolean;
}) {
  const { data, loading, error, reload } = useRemote<Rec>(`/app/matches/${matchId}/scorecard/${inningNumber}`, undefined, refreshKey);

  if (loading && !data) {
    return (
      <div className="space-y-3" aria-busy="true">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  if (error && !data) return <ErrorState message={error} onRetry={reload} />;
  if (!data) return null;

  const inning: Rec = data.inning || {};
  const batting: Rec[] = [...(data.batting || [])].sort((a, b) => (a.battingPosition || 99) - (b.battingPosition || 99));
  const bowling: Rec[] = data.bowling || [];
  const fow: Rec[] = data.fallOfWickets || [];

  const isCurrent = (r: Rec) => !r.isOut && currentIds.includes(idOf(r.playerId));
  const faced = batting.filter((r) => r.isOut || (r.balls || 0) > 0 || (r.runs || 0) > 0 || isCurrent(r));
  const yetToBat = batting.filter((r) => !faced.includes(r));
  const bowled = bowling.filter((r) => (r.balls || 0) > 0 || (r.overs || 0) > 0 || (r.runs || 0) > 0 || (r.wickets || 0) > 0);

  const extrasTotal = inning.extras ?? 0;
  const extrasDetail = [
    inning.byes ? `b ${inning.byes}` : "",
    inning.legByes ? `lb ${inning.legByes}` : "",
    inning.wides ? `w ${inning.wides}` : "",
    inning.noBalls ? `nb ${inning.noBalls}` : "",
    inning.penalties ? `p ${inning.penalties}` : "",
  ].filter(Boolean).join(", ");
  const bpo = hundred ? 5 : 6;
  const oversText = hundred ? `${inning.totalBalls || 0} balls` : `${Math.floor((inning.totalBalls || 0) / bpo)}.${(inning.totalBalls || 0) % bpo} ov`;

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <caption className="sr-only">Batting scorecard</caption>
            <thead className="bg-surface2">
              <tr>
                <th scope="col" className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Batter</th>
                <th scope="col" className={th}>R</th>
                <th scope="col" className={th}>B</th>
                <th scope="col" className={th}>4s</th>
                <th scope="col" className={th}>6s</th>
                <th scope="col" className={th}>SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {faced.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-6 text-center text-sm text-muted">No batting data yet</td></tr>
              )}
              {faced.map((r) => (
                <tr key={r._id || idOf(r.playerId)}>
                  <td className="px-3 py-2.5">
                    <p className={`text-sm ${r.isOut ? "text-ink" : "text-ink font-semibold"}`}>
                      {playerName(r.playerId)}
                      {isCurrent(r) && <span className="ml-1 text-accent" aria-label="at the crease">*</span>}
                    </p>
                    <p className="text-xs text-muted">{dismissalText({ ...r, isCurrent: isCurrent(r) })}</p>
                  </td>
                  <td className={`${td} font-semibold text-ink`}>{r.runs ?? 0}</td>
                  <td className={td}>{r.balls ?? 0}</td>
                  <td className={td}>{r.fours ?? 0}</td>
                  <td className={td}>{r.sixes ?? 0}</td>
                  <td className={`${td} text-muted`}>{(r.balls || 0) > 0 ? fixed(r.strikeRate ?? (r.runs / r.balls) * 100) : "–"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-line bg-surface2/60">
              <tr>
                <td className="px-3 py-2.5 text-sm text-muted">Extras</td>
                <td colSpan={5} className="px-3 py-2.5 text-right text-sm num">
                  <span className="font-semibold text-ink">{extrasTotal}</span>
                  {extrasDetail && <span className="ml-2 text-muted">({extrasDetail})</span>}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-sm font-semibold text-ink">Total</td>
                <td colSpan={5} className="px-3 py-2.5 text-right text-sm num">
                  <span className="font-semibold text-ink">{inning.totalRuns ?? 0}/{inning.totalWickets ?? 0}</span>
                  <span className="ml-2 text-muted">({oversText})</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {yetToBat.length > 0 && !matchDone && (
          <p className="border-t border-line px-3 py-3 text-xs text-muted">
            <span className="font-semibold text-ink">Yet to bat: </span>
            {yetToBat.map((r) => playerName(r.playerId)).join(", ")}
          </p>
        )}
      </div>

      {fow.length > 0 && (
        <div className="card p-4">
          <h3 className="mb-2 text-sm font-semibold text-ink">Fall of wickets</h3>
          <p className="text-sm leading-relaxed text-muted">
            {fow.map((w, i) => (
              <span key={i} className="mr-3 inline-block num">
                <span className="font-medium text-ink">{w.score}</span> ({w.batsmanName}{w.over ? `, ${w.over} ov` : ""})
              </span>
            ))}
          </p>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] text-left">
            <caption className="sr-only">Bowling figures</caption>
            <thead className="bg-surface2">
              <tr>
                <th scope="col" className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted">Bowler</th>
                <th scope="col" className={th}>{hundred ? "B" : "O"}</th>
                <th scope="col" className={th}>M</th>
                <th scope="col" className={th}>R</th>
                <th scope="col" className={th}>W</th>
                <th scope="col" className={th}>Econ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {bowled.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-6 text-center text-sm text-muted">No bowling data yet</td></tr>
              )}
              {bowled.map((r) => (
                <tr key={r._id || idOf(r.playerId)}>
                  <td className="px-3 py-2.5 text-sm font-medium text-ink">{playerName(r.playerId)}</td>
                  <td className={td}>{hundred ? r.balls ?? 0 : fixed(r.overs, 1)}</td>
                  <td className={td}>{r.maidens ?? 0}</td>
                  <td className={td}>{r.runs ?? 0}</td>
                  <td className={`${td} font-semibold text-ink`}>{r.wickets ?? 0}</td>
                  <td className={`${td} text-muted`}>{fixed(r.economy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
