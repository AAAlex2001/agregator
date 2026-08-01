"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  fetchDirectionProfile,
  fetchMyDirections,
  saveDirectionProfile,
  useDirectionCatalogs,
  type DirectionKey,
  type DirectionProfile,
  type DirectionSummary,
} from "@/source/entities/direction";
import type { UserRole } from "@/source/entities/user";
import { useSession } from "@/source/features/session";
import { emptyDirectionValue, getDirectionForm, validateDirection } from "@/source/features/direction-forms";

export function useProfileDirections(role: UserRole) {
  const { showSuccess, showError } = useNotifications();
  const { reload } = useSession();
  const catalogs = useDirectionCatalogs();
  const [directions, setDirections] = useState<DirectionSummary[]>([]);
  const [activeKey, setActiveKey] = useState<DirectionKey | null>(null);
  const [profile, setProfile] = useState<DirectionProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
    if (!activeKey) return;
    let alive = true;
    setProfile(null);
    fetchDirectionProfile(activeKey)
      .then((loaded) => {
        if (alive) setProfile({ ...emptyDirectionValue(activeKey, role), ...loaded });
      })
      .catch(() => {
        if (alive) setProfile(emptyDirectionValue(activeKey, role));
      });
    return () => {
      alive = false;
    };
  }, [activeKey, role]);

  const save = async () => {
    if (!activeKey || !profile) return;
    const message = validateDirection(activeKey, role, profile);
    if (message) {
      showError(message);
      return;
    }
    setIsSaving(true);
    try {
      setProfile(await saveDirectionProfile(activeKey, profile));
      await reload();
      showSuccess("Анкета направления сохранена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить анкету");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    catalogs,
    directions,
    activeKey,
    profile,
    isSaving,
    selectDirection: setActiveKey,
    changeProfile: setProfile,
    save,
  };
}
