import { api, unwrap } from "@/lib/api";
import type { MatchSummary, Rec } from "@/lib/types";
import { HomeMatches, type HomeData } from "@/components/HomeMatches";
import { FeaturedSeries } from "@/components/SideLists";

export const dynamic = "force-dynamic";

async function safe<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const list = (query: Rec) => safe(api("/app/matches", { query, revalidate: 5 }));
  const [live, upcoming, results, series] = await Promise.all([
    list({ status: "live", limit: 30 }),
    list({ status: "scheduled", direction: "future", limit: 30 }),
    list({ status: "completed", direction: "past", limit: 30 }),
    safe(api("/app/series", { query: { onHome: true, limit: 8 }, revalidate: 60 })),
  ]);

  const initial: HomeData = {
    live: live ? unwrap<MatchSummary[]>(live) || [] : [],
    upcoming: upcoming ? unwrap<MatchSummary[]>(upcoming) || [] : [],
    results: results ? unwrap<MatchSummary[]>(results) || [] : [],
  };
  const failed = !live && !upcoming && !results;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <h1 className="sr-only">Live cricket scores</h1>
        <HomeMatches initial={initial} failed={failed} />
      </div>
      <aside className="space-y-8">
        <FeaturedSeries series={series ? unwrap<Rec[]>(series) || [] : []} />
      </aside>
    </div>
  );
}
