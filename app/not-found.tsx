import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto mt-10 max-w-md px-6 py-12 text-center">
      <p className="text-4xl font-semibold text-ink">404</p>
      <p className="mt-2 text-muted">We couldn’t find that page.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90">
        Back to matches
      </Link>
    </div>
  );
}
