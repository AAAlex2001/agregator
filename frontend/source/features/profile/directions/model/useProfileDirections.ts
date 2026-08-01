"use client";

import { useEffect, useRef, useState } from "react";
import {
  fetchDirectionProfile,
  fetchMyDirections,
  saveDirectionProfile,
  useDirectionCatalogs,
  type DirectionKey,
  type DirectionProfile,
  type DirectionSummary,
} from "@/source/entities/direction";
import { useRegisterProfileSave, type UserRole } from "@/source/entities/user";
import {
  emptyDirectionValue,
  getDirectionForm,
  validateDirection,
} from "@/source/features/direction-forms";

export function useProfileDirections(role: UserRole) {
  const catalogs = useDirectionCatalogs();
  const requested = useRef<Set<DirectionKey>>(new Set());
  const [directions, setDirections] = useState<DirectionSummary[]>([]);
  const [activeKey, setActiveKey] = useState<DirectionKey | null>(null);
  const [profiles, setProfiles] = useState<Partial<Record<DirectionKey, DirectionProfile>>>({});
  const [dirty, setDirty] = useState<DirectionKey[]>([]);

  useEffect(() => {
    let alive = true;
    fetchMyDirections()
      .then((list) => {
        if (!alive) return;
        const supported = list.filter((item) => getDirectionForm(item.key, role));
        setDirections(supported);
        setActiveKey(supported[0]?.key ?? null);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [role]);

  useEffect(() => {
    const key = activeKey;
    if (!key || requested.current.has(key)) return;
    requested.current.add(key);

    let alive = true;
    fetchDirectionProfile(key)
      .then((loaded) => {
        if (alive) setProfiles((current) => ({ ...current, [key]: loaded }));
      })
      .catch(() => {
        if (alive) setProfiles((current) => ({ ...current, [key]: emptyDirectionValue(key, role) }));
      });
    return () => {
      alive = false;
    };
  }, [activeKey, role]);

  useRegisterProfileSave(async () => {
    for (const key of dirty) {
      const value = profiles[key];
      if (!value) continue;
      const message = validateDirection(key, role, value);
      if (message) throw new Error(`${titleOf(directions, key)}: ${message}`);
      await saveDirectionProfile(key, value);
    }
    setDirty([]);
  });

  const changeProfile = (value: DirectionProfile) => {
    const key = activeKey;
    if (!key) return;
    setProfiles((current) => ({ ...current, [key]: value }));
    setDirty((current) => (current.includes(key) ? current : [...current, key]));
  };

  return {
    catalogs,
    directions,
    activeKey,
    profile: activeKey ? (profiles[activeKey] ?? null) : null,
    selectDirection: setActiveKey,
    changeProfile,
  };
}

function titleOf(directions: DirectionSummary[], key: DirectionKey): string {
  return directions.find((item) => item.key === key)?.title ?? key;
}
