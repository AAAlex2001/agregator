"use client";

import { useEffect, useState } from "react";
import { fetchExpertsMap } from "../api/experts.api";
import type { ExpertMapItemApi } from "./types";

export function useExpertsMap(direction?: string | null) {
  const [loaded, setLoaded] = useState<ExpertMapItemApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (direction === null) return;
    let active = true;
    fetchExpertsMap(direction)
      .then((data) => {
        if (active) setLoaded(data.items);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [direction]);

  if (direction === null) {
    return { items: [], isLoading: false };
  }
  return { items: loaded, isLoading };
}
