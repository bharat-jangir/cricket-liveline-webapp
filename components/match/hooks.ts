"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, unwrap } from "@/lib/api";
import type { Rec } from "@/lib/types";

/** Fetches a resource and refetches whenever `refreshKey` changes (silently, no spinner flicker). */
export function useRemote<T = Rec>(path: string | null, query?: Rec, refreshKey: unknown = 0) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState<string | null>(null);
  const first = useRef(true);
  const queryKey = JSON.stringify(query || {});

  const load = useCallback(
    async (silent: boolean) => {
      if (!path) return;
      if (!silent) setLoading(true);
      try {
        const res = await api(path, { query: JSON.parse(queryKey) });
        setData(unwrap<T>(res));
        setError(null);
      } catch (e) {
        if (!silent || first.current) setError((e as Error).message);
      } finally {
        first.current = false;
        setLoading(false);
      }
    },
    [path, queryKey],
  );

  // path/query change => hard load; refreshKey change => silent refresh
  useEffect(() => {
    first.current = true;
    setData(null);
    load(false);
  }, [load]);

  const keyRef = useRef(refreshKey);
  useEffect(() => {
    if (keyRef.current !== refreshKey) {
      keyRef.current = refreshKey;
      load(true);
    }
  }, [refreshKey, load]);

  return { data, loading, error, reload: () => load(false) };
}
