"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, unwrap } from "@/lib/api";
import type { Rec } from "@/lib/types";
import { useLiveSocket } from "@/lib/socket";
import { idOf, teamCode } from "@/lib/format";
import { inningScores, isHundred } from "@/lib/match";
import { Tabs, TabPanel } from "../ui";
import { ScoreHeader } from "./ScoreHeader";
import { LiveTab } from "./LiveTab";
import { InningScorecard } from "./Scorecard";
import { CommentaryTab } from "./CommentaryTab";
import { SquadsTab } from "./SquadsTab";
import { InfoTab } from "./InfoTab";

type TabKey = "live" | "scorecard" | "commentary" | "squads" | "info";

export function MatchCenter({ initialMatch, initialLive }: { initialMatch: Rec; initialLive: Rec | null }) {
  const matchId = idOf(initialMatch);
  const [match] = useState<Rec>(initialMatch);
  const [live, setLive] = useState<Rec | null>(initialLive);
  const status: string = live?.matchStatus || match.status;
  const isLive = status === "live";
  const isDone = status === "completed";
  const hundred = isHundred(match, live);

  const [tab, setTab] = useState<TabKey>(isLive ? "live" : isDone ? "scorecard" : status === "scheduled" ? "info" : "scorecard");
  const [tick, setTick] = useState(0); // bumps on every realtime event
  const [resetKey, setResetKey] = useState(0); // bumps on undo
  const [selectedInning, setSelectedInning] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshLive = useCallback(async () => {
    try {
      const res = await api(`/app/matches/${matchId}/live-status`);
      setLive(unwrap<Rec>(res));
    } catch {
      /* keep last known state */
    }
  }, [matchId]);

  const scheduleRefresh = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      refreshLive();
      setTick((t) => t + 1);
    }, 350);
  }, [refreshLive]);

  const connected = useLiveSocket(
    { matchId },
    {
      scoreUpdate: (u: Rec) => {
        // Instant header update, then reconcile with the server
        setLive((prev) => {
          if (!prev?.innings || !u?.inning) return prev;
          return {
            ...prev,
            currentInning: u.currentInning ?? prev.currentInning,
            runRate: u.runRate ?? prev.runRate,
            recentBalls: u.recentBalls ?? prev.recentBalls,
            innings: prev.innings.map((i: Rec) =>
              i.inningNumber === u.inning.number ? { ...i, totalRuns: u.inning.totalRuns, totalWickets: u.inning.wickets, totalBalls: u.inning.totalBalls } : i,
            ),
          };
        });
        if (u?.currentBall === "confirming") setResetKey((k) => k + 1); // undo
        scheduleRefresh();
      },
      scorecard_delta: () => scheduleRefresh(),
      inning_change: () => scheduleRefresh(),
      commentary_added: () => scheduleRefresh(),
      powerplay_update: () => scheduleRefresh(),
    },
  );

  // Polling fallback while live and socket is down; slow reconcile otherwise
  useEffect(() => {
    if (!isLive) return;
    const t = setInterval(scheduleRefresh, connected ? 60_000 : 8_000);
    return () => clearInterval(t);
  }, [isLive, connected, scheduleRefresh]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const innings = inningScores(live);
  const currentInningNo: number = live?.currentInning || innings[innings.length - 1]?.number || 1;
  const shownInning = selectedInning ?? currentInningNo;
  const currentIds = [idOf(live?.currentStrikerId), idOf(live?.currentNonStrikerId)].filter(Boolean);

  const tabs: { value: TabKey; label: string }[] = [
    { value: "live", label: "Live" },
    { value: "scorecard", label: "Scorecard" },
    { value: "commentary", label: "Commentary" },
    { value: "squads", label: "Squads" },
    { value: "info", label: "Info" },
  ];

  return (
    <div className="space-y-5">
      <ScoreHeader match={match} liveStatus={live} />

      {isLive && !connected && (
        <p role="status" className="rounded-lg border border-line bg-surface2 px-4 py-2 text-sm text-muted">
          Reconnecting to live updates… refreshing every few seconds in the meantime.
        </p>
      )}

      <Tabs label="Match sections" value={tab} onChange={setTab} tabs={tabs.filter((t) => t.value !== "live" || isLive || isDone)} />

      <TabPanel id={tab}>
        {tab === "live" && <LiveTab matchId={matchId} liveStatus={live} refreshKey={tick} hundred={hundred} />}

        {tab === "scorecard" && (
          <div className="space-y-4">
            {innings.length > 1 && (
              <div role="group" aria-label="Innings" className="scroll-x flex gap-2">
                {innings.map((i) => (
                  <button
                    key={i.number}
                    type="button"
                    aria-pressed={shownInning === i.number}
                    onClick={() => setSelectedInning(i.number)}
                    className={`whitespace-nowrap rounded-lg border px-3.5 py-2 text-sm num ${shownInning === i.number ? "border-brand bg-brand text-white" : "border-line bg-surface text-muted hover:text-ink"}`}
                  >
                    {teamCode({ code: i.teamCode })} {i.runs}/{i.wickets}
                    {i.type === "super_over" && <span className="ml-1 text-xs opacity-80">(SO)</span>}
                  </button>
                ))}
              </div>
            )}
            <InningScorecard matchId={matchId} inningNumber={shownInning} refreshKey={tick} hundred={hundred} currentIds={currentIds} matchDone={isDone} />
          </div>
        )}

        {tab === "commentary" && <CommentaryTab matchId={matchId} refreshKey={tick} resetKey={resetKey} hundred={hundred} />}
        {tab === "squads" && <SquadsTab matchId={matchId} />}
        {tab === "info" && <InfoTab match={match} liveStatus={live} />}
      </TabPanel>
    </div>
  );
}
