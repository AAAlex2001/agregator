"use client";

import { useEffect, useState } from "react";
import {
  fetchAvailableRoles,
  type AvailableRole,
} from "@/source/entities/session";
import type { SessionRole } from "./types";

export function useAvailableRoles(currentRole: SessionRole | null) {
  const [roles, setRoles] = useState<AvailableRole[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentRole === null) {
      setRoles([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetchAvailableRoles()
      .then((next) => {
        if (cancelled) return;
        setRoles(next);
      })
      .catch(() => {
        if (cancelled) return;
        setRoles([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentRole]);

  return { roles, loading };
}
