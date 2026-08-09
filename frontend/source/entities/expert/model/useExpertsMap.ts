"use client";

import { useEffect, useState } from "react";
import { fetchExpertsMap } from "../api/experts.api";
import type { ExpertMapItemApi } from "./types";

export function useExpertsMap() {
  const [items, setItems] = useState<ExpertMapItemApi[]>([]);

  useEffect(() => {
    let active = true;
    fetchExpertsMap()
      .then((data) => {
        if (active) setItems(data.items);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return { items };
}
