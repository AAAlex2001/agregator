"use client";

import { useEffect, useState } from "react";
import { fetchDirectionCatalogs } from "../api/direction.api";
import { EMPTY_CATALOGS } from "./catalogs";
import type { DirectionCatalogs } from "./types";

let cache: Promise<DirectionCatalogs> | null = null;

function loadCatalogs(): Promise<DirectionCatalogs> {
  if (!cache) {
    cache = fetchDirectionCatalogs().catch((error) => {
      cache = null;
      throw error;
    });
  }
  return cache;
}

export function useDirectionCatalogs(enabled = true): DirectionCatalogs {
  const [catalogs, setCatalogs] = useState<DirectionCatalogs>(EMPTY_CATALOGS);

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    loadCatalogs()
      .then((next) => {
        if (alive) setCatalogs(next);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [enabled]);

  return catalogs;
}
