import type { Metadata } from "next";
import { api } from "@/lib/api";
import type { Rec } from "@/lib/types";
import { ShortsGrid } from "@/components/ShortsGrid";
import { ErrorState } from "@/components/ui";

export const metadata: Metadata = { title: "Shorts", description: "Quick cricket highlights." };
export const dynamic = "force-dynamic";

export default async function ShortsPage() {
  let shorts: Rec[] | null = null;
  try {
    shorts = ((await api("/app/shorts", { query: { limit: 24 }, revalidate: 30 })) as Rec).result || [];
  } catch {
    shorts = null;
  }
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold tracking-tight text-ink">Shorts</h1>
      {shorts ? <ShortsGrid shorts={shorts} /> : <ErrorState message="We couldn’t load shorts right now." />}
    </div>
  );
}
