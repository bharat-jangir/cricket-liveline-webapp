"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Matches" },
  { href: "/series", label: "Series" },
  { href: "/rankings", label: "Rankings" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" || pathname.startsWith("/match") : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 bg-brand text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight" onClick={() => setOpen(false)}>
          <span aria-hidden className="grid place-items-center size-8 rounded-lg bg-accent text-brand font-bold">C</span>
          <span className="text-[17px]">Cricket Liveline</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-1 ml-2">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive(n.href) ? "bg-white/15 text-white" : "text-white/70 hover:text-white hover:bg-white/10"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className="md:hidden grid place-items-center size-9 rounded-lg hover:bg-white/10"
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
        <nav aria-label="Mobile" className="md:hidden border-t border-white/10 px-4 py-2 flex flex-col">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`px-2 py-3 text-sm rounded-lg ${isActive(n.href) ? "text-white font-medium" : "text-white/70"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
