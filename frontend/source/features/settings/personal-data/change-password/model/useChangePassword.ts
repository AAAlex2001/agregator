"use client";

import { useState } from "react";
import { PASSWORD_MIN_LENGTH, changePassword } from "@/source/entities/user";
import { useNotifications } from "@/source/shared/ui/Notifications";

const EMPTY = { password: "", repeatPassword: "" };

/** Смена пароля: проверка длины и совпадения, затем сохранение и очистка полей. */
export function useChangePassword() {
  const { showError, showSuccess } = useNotifications();
  const [fields, setFields] = useState(EMPTY);
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    if (fields.password.length < PASSWORD_MIN_LENGTH) {
      showError(`Пароль должен быть не менее ${PASSWORD_MIN_LENGTH} символов`);
      return;
    }
    if (fields.password !== fields.repeatPassword) {
      showError("Пароли не совпадают");
      return;
    }

    setIsSaving(true);
    try {
      await changePassword(fields.password, fields.repeatPassword);
      setFields(EMPTY);
      showSuccess("Пароль изменён");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сменить пароль");
    } finally {
      setIsSaving(false);
    }
  };

  return { fields, isSaving, change: setFields, save };
}
