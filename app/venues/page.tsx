import type { Metadata } from "next";
import { VenuesDirectory } from "@/components/Directory";

export const metadata: Metadata = { title: "Venues", description: "Cricket grounds around the world." };

export default function VenuesPage() {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold tracking-tight text-ink">Venues</h1>
      <VenuesDirectory />
    </div>
  );
}
