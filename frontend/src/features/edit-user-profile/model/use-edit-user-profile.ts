"use client";

import { useState } from "react";
import { useUpdateUserProfile } from "@/entities/user";
import type { UserProfile } from "@/entities/user";
import {
  formatRussianPhone,
  toRussianPhoneApiValue,
} from "@/shared/lib/phone";
import { useNotifications } from "@/shared/ui/notifications";
import type { UserProfileFields } from "./types";

/** Хранит введённые данные и передаёт их операции сохранения профиля. */
export function useEditUserProfile(profile: UserProfile) {
  const { isSaving, saveProfile } = useUpdateUserProfile();
  const { showError, showSuccess } = useNotifications();
  const [fields, setFields] = useState<UserProfileFields>({
    firstName: profile.first_name ?? "",
    lastName: profile.last_name ?? "",
    phone: formatRussianPhone(profile.phone ?? ""),
  });

  /** Обновляет имя в черновике формы. */
  function changeFirstName(firstName: string) {
    setFields((current) => ({
      ...current,
      firstName,
    }));
  }

  /** Обновляет фамилию в черновике формы. */
  function changeLastName(lastName: string) {
    setFields((current) => ({
      ...current,
      lastName,
    }));
  }

  /** Форматирует телефон по мере ввода. */
  function changePhone(phone: string) {
    setFields((current) => ({
      ...current,
      phone: formatRussianPhone(phone),
    }));
  }

  /** Сохраняет заполненные поля и сообщает результат пользователю. */
  async function save() {
    if (isSaving) {
      return;
    }

    try {
      await saveProfile({
        first_name: fields.firstName.trim(),
        last_name: fields.lastName.trim(),
        phone: toRussianPhoneApiValue(fields.phone) || undefined,
      });
      showSuccess("Данные сохранены");
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Не удалось сохранить данные",
      );
    }
  }

  return {
    fields,
    isSaving,
    changeFirstName,
    changeLastName,
    changePhone,
    save,
  };
}
