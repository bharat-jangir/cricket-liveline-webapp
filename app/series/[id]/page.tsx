import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api, ApiError, unwrap } from "@/lib/api";
import type { MatchSummary, Rec } from "@/lib/types";
import { SeriesDetail } from "@/components/SeriesDetail";
import { ErrorState } from "@/components/ui";

export const dynamic = "force-dynamic";
const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!OBJECT_ID.test(id)) return { title: "Series not found" };
  try {
    const s = unwrap<Rec>(await api(`/app/series/${id}`, { revalidate: 60 }));
    return { title: s?.name || "Series" };
  } catch {
    return { title: "Series" };
  }
}

export default async function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!OBJECT_ID.test(id)) notFound();

  let series: Rec | null = null;
  try {
    series = unwrap<Rec>(await api(`/app/series/${id}`, { revalidate: 30 }));
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400)) notFound();
    return <ErrorState message="We couldn’t load this series." />;
  }
  if (!series || !series._id) notFound();

  const [matches, points] = await Promise.all([
    api("/app/matches", { query: { seriesId: id, limit: 50 }, revalidate: 15 }).then((r) => unwrap<MatchSummary[]>(r) || []).catch(() => []),
    api(`/app/series/${id}/points-table`, { revalidate: 30 }).then((r) => unwrap<Rec[]>(r) || []).catch(() => []),
  ]);

  return <SeriesDetail series={series} matches={matches} points={points} />;
}
