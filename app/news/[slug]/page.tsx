import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError, unwrap } from "@/lib/api";
import type { Rec } from "@/lib/types";
import { categoryLabel, formatDate, parseBody } from "@/lib/format";
import { NewsCard } from "@/components/NewsCard";
import { ErrorState } from "@/components/ui";

export const dynamic = "force-dynamic";

async function load(slug: string) {
  return unwrap<Rec>(await api(`/app/news/${encodeURIComponent(slug)}`));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const a = await load(slug);
    return {
      title: a.title,
      description: a.summary || undefined,
      openGraph: { title: a.title, description: a.summary || undefined, type: "article", images: a.coverImage ? [a.coverImage] : undefined },
    };
  } catch {
    return { title: "News" };
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let a: Rec | null = null;
  try {
    a = await load(slug);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 400)) notFound();
    return <ErrorState message="We couldn’t load this article." />;
  }
  if (!a) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Link href="/news" className="text-sm text-accent hover:underline">← All news</Link>
      <span className="mt-4 block w-fit rounded-md bg-accentsoft px-2 py-0.5 text-xs font-semibold text-accent">{categoryLabel(a.category)}</span>
      <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink">{a.title}</h1>
      <p className="mt-2 text-sm text-muted">{[a.authorName, formatDate(a.publishedAt, true)].filter(Boolean).join(" · ")}</p>
      {a.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.coverImage} alt="" className="mt-6 w-full rounded-xl bg-surface2 object-cover" />
      )}
      {a.summary && <p className="mt-6 text-lg font-medium text-muted">{a.summary}</p>}
      <div className="mt-6 space-y-4">
        {parseBody(a.body).map((b, i) =>
          b.type === "h" ? (
            <h2 key={i} className="pt-2 text-xl font-semibold text-ink">{b.text}</h2>
          ) : (
            <p key={i} className="whitespace-pre-line leading-relaxed text-ink/90">{b.text}</p>
          ),
        )}
      </div>
      {a.tags?.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-2">
          {a.tags.map((t: string) => <li key={t} className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">#{t}</li>)}
        </ul>
      )}
      {a.related?.length > 0 && (
        <section className="mt-12" aria-label="Related articles">
          <h2 className="mb-3 text-base font-semibold text-ink">Related</h2>
          <div className="grid gap-4 sm:grid-cols-3">{a.related.map((r: Rec) => <NewsCard key={r._id} article={r} />)}</div>
        </section>
      )}
    </article>
  );
}
