import type { Metadata } from "next";
import { PlayersDirectory } from "@/components/Directory";

export const metadata: Metadata = { title: "Players", description: "Browse cricketers and their career stats." };

export default function PlayersPage() {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold tracking-tight text-ink">Players</h1>
      <PlayersDirectory />
    </div>
  );
}
