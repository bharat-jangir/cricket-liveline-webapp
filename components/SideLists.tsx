import Link from "next/link";
import type { Rec } from "@/lib/types";
import { formatDate, formatLabel } from "@/lib/format";
import { EmptyState, FormatBadge, SectionTitle } from "./ui";

export function FeaturedSeries({ series }: { series: Rec[] }) {
  return (
    <section aria-label="Featured series">
      <SectionTitle action={<Link href="/series" className="text-sm text-accent hover:underline">View all</Link>}>Featured series</SectionTitle>
      {series.length === 0 ? (
        <EmptyState title="No series yet" />
      ) : (
        <ul className="card divide-y divide-line">
          {series.slice(0, 8).map((s) => (
            <li key={s._id}>
              <Link href={`/series/${s._id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface2 first:rounded-t-[14px] last:rounded-b-[14px]">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{s.name}</p>
                  <p className="text-xs text-muted">
                    {formatDate(s.startDate)}
                    {s.endDate ? ` – ${formatDate(s.endDate)}` : ""}
                  </p>
                </div>
                {s.activeFormat && <FormatBadge>{formatLabel(s.activeFormat)}</FormatBadge>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
