"use client";

import { useState } from "react";
import { PASSWORD_MIN_LENGTH, useChangePassword } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";
import type { ChangePasswordFields } from "./types";

/** Проверяет два поля пароля и очищает их после успешного сохранения. */
export function useChangePasswordForm() {
  const { isSaving, savePassword } = useChangePassword();
  const { showError, showSuccess } = useNotifications();
  const [fields, setFields] = useState<ChangePasswordFields>({
    password: "",
    repeatedPassword: "",
  });

  /** Обновляет новый пароль в форме. */
  function changePassword(password: string) {
    setFields((current) => ({
      ...current,
      password,
    }));
  }

  /** Обновляет повторный ввод пароля. */
  function changeRepeatedPassword(repeatedPassword: string) {
    setFields((current) => ({
      ...current,
      repeatedPassword,
    }));
  }

  /** Проверяет длину и совпадение паролей перед отправкой. */
  async function save() {
    if (isSaving) {
      return;
    }

    if (fields.password.length < PASSWORD_MIN_LENGTH) {
      showError(`Пароль должен быть не менее ${PASSWORD_MIN_LENGTH} символов`);
      return;
    }

    if (fields.password !== fields.repeatedPassword) {
      showError("Пароли не совпадают");
      return;
    }

    try {
      await savePassword(fields.password, fields.repeatedPassword);
      setFields({
        password: "",
        repeatedPassword: "",
      });
      showSuccess("Пароль изменён");
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось сменить пароль",
      );
    }
  }

  return {
    fields,
    isSaving,
    changePassword,
    changeRepeatedPassword,
    save,
  };
}
