import type { Metadata } from "next";
import { SearchResults } from "@/components/SearchResults";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const term = (q || "").trim().slice(0, 60);
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold tracking-tight text-ink">{term ? `Results for “${term}”` : "Search"}</h1>
      <SearchResults q={term} />
    </div>
  );
}
