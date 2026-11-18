import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api, ApiError, unwrap } from "@/lib/api";
import type { Rec } from "@/lib/types";
import { PlayerProfile } from "@/components/PlayerProfile";
import { ErrorState } from "@/components/ui";

export const dynamic = "force-dynamic";
const OBJECT_ID = /^[0-9a-fA-F]{24}$/;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!OBJECT_ID.test(id)) return { title: "Player not found" };
  try {
    const r = unwrap<Rec>(await api(`/app/players/${id}`, { revalidate: 60 }));
    return { title: r?.name || "Player" };
  } catch {
    return { title: "Player" };
  }
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!OBJECT_ID.test(id)) notFound();
  let item: Rec | null = null;
  try {
    item = unwrap<Rec>(await api(`/app/players/${id}`, { revalidate: 30 }));
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400)) notFound();
    return <ErrorState message="We couldn’t load this page." />;
  }
  if (!item || !item._id) notFound();
  return <PlayerProfile player={item} />;
}
