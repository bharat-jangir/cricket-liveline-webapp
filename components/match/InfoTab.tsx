import type { Rec } from "@/lib/types";
import { formatDate, formatLabel, formatTime, teamName } from "@/lib/format";

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-4 px-4 py-3">
      <dt className="w-32 shrink-0 text-sm text-muted">{label}</dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}

export function InfoTab({ match, liveStatus }: { match: Rec; liveStatus: Rec | null }) {
  const venue = match.venueId as Rec | undefined;
  const o = match.officials as Rec | undefined;
  const nm = (u: unknown) => (u && typeof u === "object" ? (u as Rec).name || (u as Rec).fullName : undefined);
  const venueText = venue && typeof venue === "object" ? [venue.name, venue.city, venue.country].filter(Boolean).join(", ") : "";
  const toss = liveStatus?.toss?.tossText || match.toss?.tossText;

  return (
    <dl className="card divide-y divide-line">
      <Row label="Match" value={match.title || `${teamName(match.teamAId)} vs ${teamName(match.teamBId)}`} />
      <Row label="Series" value={teamName(match.seriesId, "")} />
      <Row label="Format" value={formatLabel(match.matchFormat)} />
      <Row label="Date" value={match.matchDate ? formatDate(match.matchDate, true) : ""} />
      <Row label="Time" value={match.matchTime || match.matchDate ? formatTime(match.matchTime || match.matchDate) : ""} />
      <Row label="Venue" value={venueText} />
      <Row label="Toss" value={toss} />
      <Row label="On-field umpires" value={[nm(o?.umpire1Id), nm(o?.umpire2Id)].filter(Boolean).join(", ")} />
      <Row label="Third umpire" value={nm(o?.thirdUmpireId)} />
      <Row label="Match referee" value={nm(o?.refereeId)} />
      <Row label="Result" value={match.result?.resultText} />
    </dl>
  );
}
