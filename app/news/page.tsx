import type { Metadata } from "next";
import { api } from "@/lib/api";
import type { Rec } from "@/lib/types";
import { NewsList } from "@/components/NewsList";

export const metadata: Metadata = { title: "News", description: "Match reports, analysis and cricket news." };
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  let data: Rec = { result: [] };
  try {
    data = (await api("/app/news", { query: { limit: 12 }, revalidate: 30 })) as Rec;
  } catch {
    /* the client list shows an empty state / retry */
  }
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold tracking-tight text-ink">News</h1>
      <NewsList initial={data.result || []} initialPagination={data.pagination} />
    </div>
  );
}
