"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { MatchSummary, Rec } from "@/lib/types";
import { api, unwrap } from "@/lib/api";
import { useLiveSocket } from "@/lib/socket";
import { MatchCard } from "./MatchCard";
import { LiveBadge, SectionTitle } from "./ui";

/** Live matches strip with realtime score patching (the mobile home's live carousel). */
export function LiveNow({ initial }: { initial: MatchSummary[] }) {
  const [matches, setMatches] = useState(initial);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await api("/app/matches", { query: { status: "live", limit: 10 } });
      setMatches(unwrap<MatchSummary[]>(data) || []);
    } catch {
      /* keep what we have */
    }
  }, []);

  const connected = useLiveSocket("listing", {
    listing_update: (u: Rec) => {
      let known = false;
      setMatches((prev) =>
        prev.map((m) => {
          if (m.id !== u.matchId) return m;
          known = true;
          const apply = (side: MatchSummary["team1"]) => {
            const src = [u.teamA, u.teamB].find((t: Rec) => t?.teamId && t.teamId === side.id);
            return src && src.score && src.score !== "—/—" ? { ...side, score: src.score, overs: src.overs } : side;
          };
          return { ...m, team1: apply(m.team1), team2: apply(m.team2) };
        }),
      );
      // A new live match started, or one finished: reconcile with the server
      if (!known || (u.status && u.status !== "live")) {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(refresh, 800);
      }
    },
  });

  useEffect(() => {
    const t = setInterval(refresh, connected ? 90_000 : 20_000);
    return () => clearInterval(t);
  }, [connected, refresh]);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <section aria-label="Live matches">
      <SectionTitle action={<Link href="/matches" className="text-sm text-accent hover:underline">All matches</Link>}>
        <span className="inline-flex items-center gap-2">Live now {matches.length > 0 && <LiveBadge label={String(matches.length)} />}</span>
      </SectionTitle>
      {matches.length === 0 ? (
        <p className="card px-5 py-6 text-sm text-muted">No live matches right now. Check the upcoming fixtures below.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </section>
  );
}
