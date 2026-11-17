import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row gap-4 sm:items-center justify-between text-sm text-muted">
        <p>© {new Date().getFullYear()} Cricket Liveline. Live scores updated ball by ball.</p>
        <nav aria-label="Footer" className="flex gap-5">
          <Link href="/" className="hover:text-ink">Matches</Link>
          <Link href="/series" className="hover:text-ink">Series</Link>
          <Link href="/rankings" className="hover:text-ink">Rankings</Link>
        </nav>
      </div>
    </footer>
  );
}
