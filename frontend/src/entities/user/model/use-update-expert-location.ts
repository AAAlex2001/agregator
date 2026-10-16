"use client";

import { useState } from "react";
import { updateExpertLocation } from "../api/update-expert-location";
import type { UpdateExpertLocation } from "./types";
import { useUser } from "./use-user";

/** Сохраняет настройки карты и обновляет профиль текущего аккаунта. */
export function useUpdateExpertLocation() {
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useUser();

  /** Применяет подтверждённое сервером местоположение к открытому аккаунту. */
  async function saveLocation(location: UpdateExpertLocation) {
    setIsSaving(true);

    try {
      const user = await updateExpertLocation(location);
      updateUser(user);
      return user;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    saveLocation,
  };
}
