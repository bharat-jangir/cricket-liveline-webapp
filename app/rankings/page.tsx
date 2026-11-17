import type { Metadata } from "next";
import { Rankings } from "@/components/Rankings";

export const metadata: Metadata = { title: "Rankings", description: "ICC team and player rankings across Test, ODI and T20I." };

export default function RankingsPage() {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold tracking-tight text-ink">Rankings</h1>
      <Rankings />
    </div>
  );
}
