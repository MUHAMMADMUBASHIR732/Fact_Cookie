// Tiny data-fetching hook: keeps previous data while reloading, exposes error + reload.
"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = [], enabled = true) {
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(enabled);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const seq = useRef(0);

  const reload = useCallback(async () => {
    const id = ++seq.current;
    setLoading(true);
    try { const d = await fnRef.current(); if (id === seq.current) { setData(d); setError(undefined); } }
    catch (e) { if (id === seq.current) setError(e); }
    finally { if (id === seq.current) setLoading(false); }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (enabled) reload(); }, [enabled, reload, ...deps]);
  return { data, error, loading, reload, setData };
}
