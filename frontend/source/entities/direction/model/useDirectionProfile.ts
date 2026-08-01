"use client";

import { useEffect, useState } from "react";
import { fetchDirectionProfile } from "../api/direction.api";
import type { DirectionKey, DirectionProfile } from "./types";

export function useDirectionProfile(key: DirectionKey | null): DirectionProfile | null {
  const [profile, setProfile] = useState<DirectionProfile | null>(null);

  useEffect(() => {
    if (!key) return;
    let alive = true;
    fetchDirectionProfile(key)
      .then((loaded) => {
        if (alive) setProfile(loaded);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [key]);

  return profile;
}
