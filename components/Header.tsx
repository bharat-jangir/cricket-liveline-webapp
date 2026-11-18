"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

// Same information architecture as the mobile app: Home · Series · Matches · Fixtures, plus the menu items
const NAV = [
  { href: "/", label: "Home" },
  { href: "/matches", label: "Matches" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/series", label: "Series" },
  { href: "/news", label: "News" },
  { href: "/shorts", label: "Shorts" },
  { href: "/rankings", label: "Rankings" },
  { href: "/venues", label: "Venues" },
  { href: "/players", label: "Players" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/matches" && pathname.startsWith("/match/")));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (term.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(term)}`);
      setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-brand text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight shrink-0" onClick={() => setOpen(false)}>
          <span aria-hidden className="grid h-8 w-10 place-items-center rounded-lg bg-white"><Image src="/logo.svg" alt="" width={36} height={24} priority className="h-5 w-auto" /></span>
          <span className="text-[17px]">Cricket Pulse</span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5 ml-2">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`px-2.5 py-1.5 rounded-lg text-sm transition-colors ${isActive(n.href) ? "bg-white/20 text-white" : "text-white/75 hover:text-white hover:bg-white/10"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submit} role="search" className="ml-auto hidden sm:block">
          <label className="relative block">
            <span className="sr-only">Search</span>
            <svg aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search teams, players, matches…"
              className="w-56 xl:w-72 rounded-full bg-white/15 placeholder:text-white/70 text-white text-sm pl-9 pr-3 py-1.5 outline-none focus:bg-white/25"
            />
          </label>
        </form>

        <div className="ml-auto sm:ml-0 flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className="lg:hidden grid place-items-center size-9 rounded-lg hover:bg-white/10"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 px-4 py-3">
          <form onSubmit={submit} role="search" className="mb-2 sm:hidden">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              aria-label="Search"
              className="w-full rounded-full bg-white/15 placeholder:text-white/70 text-white text-sm px-4 py-2 outline-none"
            />
          </form>
          <nav aria-label="Mobile" className="grid grid-cols-2 gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`px-3 py-2.5 text-sm rounded-lg ${isActive(n.href) ? "bg-white/20 text-white font-medium" : "text-white/80"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
