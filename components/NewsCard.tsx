import Link from "next/link";
import type { Rec } from "@/lib/types";
import { categoryLabel, timeAgo } from "@/lib/format";

export function NewsCard({ article }: { article: Rec }) {
  return (
    <Link href={`/news/${article.slug || article._id}`} className="card flex h-full flex-col overflow-hidden transition hover:border-accent/60">
      {article.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.coverImage} alt="" loading="lazy" className="h-40 w-full bg-surface2 object-cover" />
      ) : (
        <div aria-hidden className="grid h-24 w-full place-items-center bg-accentsoft text-3xl">🏏</div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <span className="w-fit rounded-md bg-accentsoft px-2 py-0.5 text-[11px] font-semibold text-accent">{categoryLabel(article.category)}</span>
        <h3 className="mt-2 text-base font-semibold leading-snug text-ink">{article.title}</h3>
        {article.summary && <p className="mt-1 line-clamp-3 text-sm text-muted">{article.summary}</p>}
        <p className="mt-auto pt-3 text-xs text-faint">{[article.authorName, timeAgo(article.publishedAt)].filter(Boolean).join(" · ")}</p>
      </div>
    </Link>
  );
}
