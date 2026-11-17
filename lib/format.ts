import type { Rec } from "./types";

export const FORMAT_LABEL: Record<string, string> = {
  T20: "T20",
  T20I: "T20I",
  ODI: "ODI",
  TEST: "Test",
  T10: "T10",
  HUNDRED: "The Hundred",
  "100B": "The Hundred",
};

export function formatLabel(f?: string) {
  return FORMAT_LABEL[String(f || "").toUpperCase()] || String(f || "").toUpperCase();
}

export function teamName(t: unknown, fallback = "TBC"): string {
  if (!t) return fallback;
  if (typeof t === "string") return fallback;
  const o = t as Rec;
  return o.name || o.shortName || fallback;
}

export function teamCode(t: unknown, fallback = "TBC"): string {
  if (!t || typeof t === "string") return fallback;
  const o = t as Rec;
  return (o.code || o.shortName || (o.name ? String(o.name).slice(0, 3) : fallback)).toUpperCase();
}

export function idOf(v: unknown): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  const o = v as Rec;
  return String(o._id || o.id || "");
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export function playerName(p: unknown, fallback = "—") {
  if (!p) return fallback;
  if (typeof p === "string") return fallback;
  const o = p as Rec;
  return o.name || o.fullName || fallback;
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });
const dateLongFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });
const timeFmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" });

export function formatDate(d?: string | Date, long = false) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return (long ? dateLongFmt : dateFmt).format(date);
}

export function formatTime(d?: string | Date) {
  if (!d) return "";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  return timeFmt.format(date);
}

export function startsIn(d?: string | Date): string {
  if (!d) return "";
  const ms = new Date(d).getTime() - Date.now();
  if (isNaN(ms)) return "";
  if (ms <= 0) return "Starting soon";
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `Starts in ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Starts in ${hrs}h ${mins % 60}m`;
  const days = Math.floor(hrs / 24);
  return `Starts in ${days}d`;
}

export function oversLabel(overs: string | number | undefined, format?: string) {
  if (overs === undefined || overs === "") return "";
  return String(format).toUpperCase() === "HUNDRED" ? `${overs} balls` : `${overs} ov`;
}

export function fixed(n: unknown, d = 2) {
  const v = Number(n);
  return Number.isFinite(v) ? v.toFixed(d) : "–";
}

/** Style bucket for a ball chip. */
export function ballTone(label: string, ball?: Rec): "wicket" | "six" | "four" | "extra" | "dot" | "run" {
  const l = String(label || "").toLowerCase();
  if (ball?.isWicket || l.includes("w") && !l.includes("wd")) return "wicket";
  if (l === "6" || l.startsWith("6")) return "six";
  if (l === "4" || l.startsWith("4")) return "four";
  if (l.includes("wd") || l.includes("nb") || l.includes("lb") || l.endsWith("b") || l.startsWith("p")) return "extra";
  if (l === "0" || l === "•" || l === "") return "dot";
  return "run";
}
