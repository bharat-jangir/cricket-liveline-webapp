import type { Metadata } from "next";
import { api, unwrap } from "@/lib/api";
import type { Rec } from "@/lib/types";
import { SeriesList } from "@/components/SeriesList";
import { ErrorState } from "@/components/ui";

export const metadata: Metadata = { title: "Series", description: "Browse cricket series, fixtures and points tables." };
export const dynamic = "force-dynamic";

export default async function SeriesPage() {
  let series: Rec[] | null = null;
  try {
    series = unwrap<Rec[]>(await api("/app/series", { query: { limit: 100 }, revalidate: 60 })) || [];
  } catch {
    series = null;
  }
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold tracking-tight text-ink">Series</h1>
      {series ? <SeriesList series={series} /> : <ErrorState message="We couldn’t load the series list." />}
    </div>
  );
}
