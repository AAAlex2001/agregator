"use client";

import { useState } from "react";
import { updateDirections } from "../api/update-directions";
import { useUser } from "./use-user";

/** Сохраняет отметки направлений и обновляет профиль текущего аккаунта. */
export function useUpdateDirections() {
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useUser();

  /** Передаёт выбранные направления и применяет подтверждённый сервером профиль. */
  async function saveDirections(directions: string[]) {
    setIsSaving(true);

    try {
      const user = await updateDirections(directions);
      updateUser(user);
      return user;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    saveDirections,
  };
}
