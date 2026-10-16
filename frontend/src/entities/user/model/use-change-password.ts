"use client";

import { useState } from "react";
import { changePassword } from "../api/change-password";

/** Выполняет запрос смены пароля и сообщает форме состояние отправки. */
export function useChangePassword() {
  const [isSaving, setIsSaving] = useState(false);

  /** Отправляет новый пароль и повтор, оставляя проверки формы вызывающей фиче. */
  async function savePassword(password: string, repeatedPassword: string) {
    setIsSaving(true);

    try {
      await changePassword(password, repeatedPassword);
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    savePassword,
  };
}
