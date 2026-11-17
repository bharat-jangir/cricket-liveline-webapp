"use client";

import type { Rec } from "@/lib/types";
import { idOf, playerName, teamName } from "@/lib/format";
import { useRemote } from "./hooks";
import { EmptyState, ErrorState, Skeleton, TeamLogo } from "../ui";

function PlayerList({ title, players, squad }: { title: string; players: Rec[]; squad: Rec }) {
  if (!players?.length) return null;
  return (
    <div>
      <h4 className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-muted">{title}</h4>
      <ul className="divide-y divide-line">
        {players.map((p) => {
          const id = idOf(p);
          const tags = [
            id === idOf(squad.captainId) && "C",
            id === idOf(squad.viceCaptainId) && "VC",
            id === idOf(squad.wicketKeeperId) && "WK",
            id === idOf(squad.impactPlayerId) && "IMP",
          ].filter(Boolean) as string[];
          return (
            <li key={id} className="flex items-center gap-2 px-4 py-2.5">
              <span className="text-sm text-ink">{playerName(p)}</span>
              {tags.map((t) => (
                <span key={t} className="rounded bg-accentsoft px-1.5 text-[10px] font-semibold text-accent">{t}</span>
              ))}
              {p.role && <span className="ml-auto text-xs capitalize text-muted">{String(p.role).replace(/[_-]/g, " ")}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function SquadsTab({ matchId }: { matchId: string }) {
  const { data, loading, error, reload } = useRemote<Rec[]>(`/app/matches/${matchId}/squads`);
  if (loading) return <Skeleton className="h-64 w-full" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const squads = (Array.isArray(data) ? data : []).filter((s) => (s.playingXI?.length || 0) + (s.bench?.length || 0) > 0);
  if (squads.length === 0) return <EmptyState title="Squads not announced" hint="Playing XIs appear here once they are confirmed." />;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {squads.map((s) => (
        <section key={idOf(s)} className="card overflow-hidden" aria-label={`${teamName(s.teamId)} squad`}>
          <header className="flex items-center gap-3 border-b border-line bg-surface2 px-4 py-3">
            <TeamLogo name={teamName(s.teamId)} logo={s.teamId?.logo} size={28} />
            <h3 className="text-sm font-semibold text-ink">{teamName(s.teamId)}</h3>
          </header>
          <PlayerList title="Playing XI" players={s.playingXI} squad={s} />
          <PlayerList title="Bench" players={s.bench} squad={s} />
        </section>
      ))}
    </div>
  );
}
