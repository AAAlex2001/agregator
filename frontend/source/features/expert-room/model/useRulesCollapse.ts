"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "expert-room:rules-collapsed";

export function useRulesCollapse() {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "1") {
        setCollapsed(true);
      }
    } catch {
      // localStorage может быть недоступен — оставляем дефолт.
    }
    setHydrated(true);
  }, []);

  function toggle() {
    setCollapsed((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Ignore quota errors.
      }
      return next;
    });
  }

  return { collapsed, hydrated, toggle };
}
