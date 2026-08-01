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
import { useRegisterProfileSave, type UserRole } from "@/source/entities/user";
import {
  getDirectionForm,
  validateDirection,
  type DirectionFormComponent,
} from "@/source/features/direction-forms";

interface DirectionDraft {
  direction: DirectionSummary;
  Form: DirectionFormComponent;
  saved: DirectionProfile;
  value: DirectionProfile;
}

export function useProfileDirections(role: UserRole) {
  const { showError } = useNotifications();
  const catalogs = useDirectionCatalogs();
  const [drafts, setDrafts] = useState<DirectionDraft[]>([]);
  const [activeKey, setActiveKey] = useState<DirectionKey | null>(null);

  useEffect(() => {
    let alive = true;
    loadDrafts(role)
      .then((loaded) => {
        if (!alive) return;
        setDrafts(loaded);
        setActiveKey(loaded[0]?.direction.key ?? null);
      })
      .catch(() => showError("Не удалось загрузить направления"));
    return () => {
      alive = false;
    };
  }, [role, showError]);

  useRegisterProfileSave(async () => {
    const persisted = new Map<DirectionKey, DirectionProfile>();
    for (const draft of drafts.filter(isChanged)) {
      const message = validateDirection(draft.direction.key, role, draft.value);
      if (message) throw new Error(`${draft.direction.title}: ${message}`);
      persisted.set(draft.direction.key, await saveDirectionProfile(draft.direction.key, draft.value));
    }
    setDrafts((current) =>
      current.map((draft) => {
        const saved = persisted.get(draft.direction.key);
        return saved ? { ...draft, saved, value: saved } : draft;
      }),
    );
  });

  const changeProfile = (value: DirectionProfile) => {
    setDrafts((current) =>
      current.map((draft) => (draft.direction.key === activeKey ? { ...draft, value } : draft)),
    );
  };

  return {
    catalogs,
    tabs: drafts.map((draft) => ({ id: draft.direction.key, label: draft.direction.title })),
    activeKey,
    active: drafts.find((draft) => draft.direction.key === activeKey) ?? null,
    selectDirection: setActiveKey,
    changeProfile,
  };
}

function isChanged(draft: DirectionDraft): boolean {
  return draft.value !== draft.saved;
}

async function loadDrafts(role: UserRole): Promise<DirectionDraft[]> {
  const supported = (await fetchMyDirections()).flatMap((direction) => {
    const form = getDirectionForm(direction.key, role);
    return form ? [{ direction, Form: form.Form }] : [];
  });
  const profiles = await Promise.all(
    supported.map((item) => fetchDirectionProfile(item.direction.key)),
  );
  return supported.map((item, index) => ({
    ...item,
    saved: profiles[index],
    value: profiles[index],
  }));
}
