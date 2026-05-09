"use client";

import { useEffect, useState } from "react";
import { fetchLicenseHolders } from "../api/license-holder.api";
import type { LicenseHolderListItem } from "./types";

interface State {
  items: LicenseHolderListItem[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

const initial: State = { items: [], total: 0, isLoading: true, error: null };

export function useLicenseHolders(enabled: boolean) {
  const [state, setState] = useState<State>(initial);

  useEffect(() => {
    if (!enabled) {
      setState({ items: [], total: 0, isLoading: false, error: null });
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetchLicenseHolders(0, 50)
      .then((res) => {
        if (cancelled) return;
        setState({ items: res.items, total: res.total, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Ошибка загрузки";
        setState({ items: [], total: 0, isLoading: false, error: message });
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return state;
}
