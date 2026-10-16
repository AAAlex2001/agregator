"use client";

import { useState } from "react";
import { updateUserProfile } from "../api/update-user-profile";
import type { UpdateUserProfile } from "./types";
import { useUser } from "./use-user";

/** Сохраняет персональные данные и обновляет профиль в приложении. */
export function useUpdateUserProfile() {
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useUser();

  /** Сохраняет поля и применяет ответ, если этот аккаунт ещё открыт. */
  async function saveProfile(fields: UpdateUserProfile) {
    setIsSaving(true);

    try {
      const user = await updateUserProfile(fields);
      updateUser(user);
      return user;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    saveProfile,
  };
}
