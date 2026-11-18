import type { Metadata } from "next";
import { Fixtures } from "@/components/Fixtures";

export const metadata: Metadata = { title: "Fixtures", description: "Upcoming cricket fixtures and past results grouped by date." };

export default function FixturesPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold tracking-tight text-ink">Fixtures</h1>
      <Fixtures />
    </div>
  );
}
