import type { Rec } from "./types";

const PUBLIC_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const SERVER_BASE = (process.env.API_URL || PUBLIC_BASE).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

interface Options {
  query?: Query;
  /** seconds to cache on the server (Next data cache). 0 = no cache */
  revalidate?: number;
  signal?: AbortSignal;
  method?: "GET" | "POST";
}

function buildUrl(path: string, query?: Query) {
  const base = typeof window === "undefined" ? SERVER_BASE : PUBLIC_BASE;
  const url = new URL(`${base}${path}`);
  Object.entries(query || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });
  return url.toString();
}

/** Fetches `/app/*` public endpoints and returns the backend `data` envelope. */
export async function api<T = Rec>(path: string, opts: Options = {}): Promise<T> {
  const { query, revalidate = 0, signal, method = "GET" } = opts;
  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      signal,
      method,
      headers: { Accept: "application/json", ...(method === "POST" ? { "Content-Type": "application/json" } : {}) },
      ...(method === "POST" ? { body: "{}" } : {}),
      ...(typeof window === "undefined"
        ? revalidate > 0
          ? { next: { revalidate } }
          : { cache: "no-store" as const }
        : { cache: "no-store" as const }),
    });
  } catch {
    throw new ApiError("Unable to reach the server", 503);
  }
  let json: Rec | null = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON error body */
  }
  if (!res.ok || json?.status === false) {
    throw new ApiError(json?.userMessage || json?.message || `Request failed (${res.status})`, Number(json?.statusCode) || res.status);
  }
  return (json?.data ?? json) as T;
}

/** Most endpoints wrap a single payload as { result }. */
export function unwrap<T = Rec>(data: Rec | null | undefined): T {
  return (data && "result" in data ? data.result : data) as T;
}

export const apiSocketOrigin = (
  process.env.NEXT_PUBLIC_SOCKET_URL || PUBLIC_BASE.replace(/\/api$/, "")
).replace(/\/$/, "");
