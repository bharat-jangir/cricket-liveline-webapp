import Link from "next/link";
import { api, unwrap } from "@/lib/api";
import type { MatchSummary, Rec } from "@/lib/types";
import { FeaturedHero } from "@/components/FeaturedHero";
import { LiveNow } from "@/components/LiveNow";
import { MatchCard } from "@/components/MatchCard";
import { NewsCard } from "@/components/NewsCard";
import { SectionTitle } from "@/components/ui";

export const dynamic = "force-dynamic";

async function safe<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch {
    return null;
  }
}

const QUICK = [
  { href: "/matches", label: "Matches", icon: "🏏" },
  { href: "/fixtures", label: "Fixtures", icon: "📅" },
  { href: "/rankings", label: "Rankings", icon: "🏅" },
  { href: "/series", label: "Series", icon: "🏆" },
  { href: "/venues", label: "Venues", icon: "🏟️" },
  { href: "/players", label: "Players", icon: "👤" },
];

export default async function HomePage() {
  const list = (query: Rec) => safe(api("/app/matches", { query, revalidate: 5 }));
  const [live, upcoming, recent, series, news] = await Promise.all([
    list({ status: "live", limit: 10 }),
    list({ status: "scheduled", direction: "future", limit: 6 }),
    list({ status: "completed", direction: "past", limit: 6 }),
    safe(api("/app/series", { query: { onHome: true, limit: 5 }, revalidate: 60 })),
    safe(api("/app/news", { query: { limit: 3 }, revalidate: 30 })),
  ]);
  const newsItems: Rec[] = news ? ((news as Rec).result as Rec[]) || [] : [];
  const toList = (r: unknown) => (r ? unwrap<MatchSummary[]>(r as Rec) || [] : []);

  return (
    <div className="space-y-10">
      <h1 className="sr-only">Cricket Pulse — live cricket scores</h1>
      <FeaturedHero series={series ? unwrap<Rec[]>(series) || [] : []} />

      <nav aria-label="Quick links" className="scroll-x flex gap-3">
        {QUICK.map((q) => (
          <Link key={q.href} href={q.href} className="card flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink hover:border-accent/60">
            <span aria-hidden>{q.icon}</span>
            {q.label}
          </Link>
        ))}
      </nav>

      <LiveNow initial={toList(live)} />

      {toList(upcoming).length > 0 && (
        <section aria-label="Upcoming matches">
          <SectionTitle action={<Link href="/matches?tab=upcoming" className="text-sm text-accent hover:underline">View all</Link>}>Upcoming</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toList(upcoming).map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {newsItems.length > 0 && (
        <section aria-label="Latest news">
          <SectionTitle action={<Link href="/news" className="text-sm text-accent hover:underline">View all</Link>}>Latest news</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((a) => <NewsCard key={a._id} article={a} />)}
          </div>
        </section>
      )}

      {toList(recent).length > 0 && (
        <section aria-label="Recent results">
          <SectionTitle action={<Link href="/matches?tab=results" className="text-sm text-accent hover:underline">View all</Link>}>Recent results</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {toList(recent).map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}
    </div>
  );
}
