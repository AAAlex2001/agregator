"use client";

import { useState } from "react";
import { updateProfile, type UserProfile } from "@/source/entities/user";
import { useSession } from "@/source/entities/session";
import { formatRussianPhone, toRussianPhoneApiValue } from "@/source/shared/lib/phone";
import { useNotifications } from "@/source/shared/ui/Notifications";

interface InfoFields {
  firstName: string;
  lastName: string;
  phone: string;
}

const toFields = (profile: UserProfile): InfoFields => ({
  firstName: profile.first_name ?? "",
  lastName: profile.last_name ?? "",
  phone: formatRussianPhone(profile.phone ?? ""),
});

/** Имя, фамилия и телефон: правка полей и сохранение одним запросом. */
export function useUpdateInfo(profile: UserProfile) {
  const { setUser } = useSession();
  const { showError, showSuccess } = useNotifications();
  const [fields, setFields] = useState(() => toFields(profile));
  const [isSaving, setIsSaving] = useState(false);

  const change = (next: InfoFields) => setFields({ ...next, phone: formatRussianPhone(next.phone) });

  const save = async () => {
    setIsSaving(true);
    try {
      setUser(
        await updateProfile({
          first_name: fields.firstName.trim(),
          last_name: fields.lastName.trim(),
          phone: toRussianPhoneApiValue(fields.phone) || undefined,
        }),
      );
      showSuccess("Данные сохранены");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить данные");
    } finally {
      setIsSaving(false);
    }
  };

  return { fields, isSaving, change, save };
}
