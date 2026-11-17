import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api, ApiError, unwrap } from "@/lib/api";
import type { Rec } from "@/lib/types";
import { teamName } from "@/lib/format";
import { MatchCenter } from "@/components/match/MatchCenter";
import { ErrorState } from "@/components/ui";

export const dynamic = "force-dynamic";

const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

async function loadMatch(id: string) {
  const res = await api(`/app/matches/${id}`);
  return unwrap<Rec>(res);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!OBJECT_ID.test(id)) return { title: "Match not found" };
  try {
    const m = await loadMatch(id);
    return { title: `${teamName(m.teamAId)} vs ${teamName(m.teamBId)}`, description: m.result?.resultText || `Live score, scorecard and commentary for ${teamName(m.teamAId)} vs ${teamName(m.teamBId)}` };
  } catch {
    return { title: "Match" };
  }
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!OBJECT_ID.test(id)) notFound();

  let match: Rec | null = null;
  try {
    match = await loadMatch(id);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400)) notFound();
    return <ErrorState message="We couldn’t load this match. Please try again in a moment." />;
  }
  if (!match || !match._id) notFound();

  let live: Rec | null = null;
  try {
    live = unwrap<Rec>(await api(`/app/matches/${id}/live-status`));
  } catch {
    /* header falls back to match data */
  }

  return <MatchCenter initialMatch={match} initialLive={live} />;
}
