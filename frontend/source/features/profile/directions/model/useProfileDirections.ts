"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  fetchMyDirections,
  useDirectionCatalogs,
  type DirectionDocument,
  type DirectionKey,
  type DirectionProfile,
  type DirectionSummary,
} from "@/source/entities/direction";
import { useRegisterProfileSave, type UserRole } from "@/source/entities/user";
import {
  getDirectionForm,
  validateDirection,
  type ErasedDirectionRoleForm,
} from "@/source/features/direction-forms";

interface DirectionDraft {
  direction: DirectionSummary;
  entry: ErasedDirectionRoleForm;
  documents: DirectionDocument[];
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
      persisted.set(draft.direction.key, await draft.entry.save(draft.value));
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

  const changeDocuments = (key: DirectionKey, documents: DirectionDocument[]) => {
    setDrafts((current) =>
      current.map((draft) => (draft.direction.key === key ? { ...draft, documents } : draft)),
    );
  };

  return {
    catalogs,
    tabs: drafts.map((draft) => ({ id: draft.direction.key, label: draft.direction.title })),
    activeKey,
    active: drafts.find((draft) => draft.direction.key === activeKey) ?? null,
    selectDirection: setActiveKey,
    changeProfile,
    changeDocuments,
  };
}

function isChanged(draft: DirectionDraft): boolean {
  return draft.value !== draft.saved;
}

function profileDocuments(profile: DirectionProfile): DirectionDocument[] {
  return "documents" in profile ? profile.documents : [];
}

async function loadDrafts(role: UserRole): Promise<DirectionDraft[]> {
  const supported = (await fetchMyDirections()).flatMap((direction) => {
    const entry = getDirectionForm(direction.key, role);
    return entry ? [{ direction, entry }] : [];
  });
  const profiles = await Promise.all(supported.map((item) => item.entry.load()));
  return supported.map((item, index) => ({
    ...item,
    documents: profileDocuments(profiles[index]),
    saved: profiles[index],
    value: profiles[index],
  }));
}
