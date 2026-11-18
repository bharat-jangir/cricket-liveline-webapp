import type { Metadata } from "next";
import { api, unwrap } from "@/lib/api";
import type { MatchSummary, Rec } from "@/lib/types";
import { HomeMatches, type HomeData } from "@/components/HomeMatches";

export const metadata: Metadata = { title: "Matches", description: "Live, upcoming and recent cricket matches." };
export const dynamic = "force-dynamic";

export default async function MatchesPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const get = async (query: Rec) => {
    try {
      return unwrap<MatchSummary[]>(await api("/app/matches", { query, revalidate: 5 })) || [];
    } catch {
      return null;
    }
  };
  const [live, upcoming, results] = await Promise.all([
    get({ status: "live", limit: 30 }),
    get({ status: "scheduled", direction: "future", limit: 30 }),
    get({ status: "completed", direction: "past", limit: 30 }),
  ]);
  const initial: HomeData = { live: live || [], upcoming: upcoming || [], results: results || [] };
  const initialTab = tab === "upcoming" || tab === "results" || tab === "live" ? tab : undefined;
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold tracking-tight text-ink">Matches</h1>
      <HomeMatches initial={initial} failed={!live && !upcoming && !results} initialTab={initialTab} />
    </div>
  );
}
