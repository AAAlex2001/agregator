"use client";

import { Switch } from "@/source/shared/ui/Switch";
import { useNotifications } from "@/source/shared/ui/Notifications";
import type { UserProfile } from "@/source/entities/user";
import { NOTIFICATION_DESCRIPTORS } from "../model/descriptors";
import { useEmailPreferences } from "../model/useEmailPreferences";
import type { NotificationPreferenceDescriptor, NotificationPreferenceKey } from "../model/types";
import s from "./NotificationPreferencesForm.module.scss";

interface Props {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile | null) => void;
}

function relevantDescriptors(role: string): NotificationPreferenceDescriptor[] {
  if (role !== "CUSTOMER" && role !== "EXPERT") {
    return [];
  }
  return NOTIFICATION_DESCRIPTORS.filter((item) => item.roles.includes(role));
}

export function NotificationPreferencesForm({ profile, onProfileUpdate }: Props) {
  const { preferences, savingKey, toggle } = useEmailPreferences(profile);
  const { showError, showSuccess } = useNotifications();
  const descriptors = relevantDescriptors(profile.role);

  const handleToggle = async (key: NotificationPreferenceKey, next: boolean) => {
    const result = await toggle(key, next);
    if (result.errorMessage) {
      showError(result.errorMessage);
      return;
    }
    if (result.profile) {
      onProfileUpdate(result.profile);
    }
    if (result.successMessage) {
      showSuccess(result.successMessage);
    }
  };

  return (
    <div className={s.form}>
      <header className={s.header}>
        <h2 className={s.title}>Почтовые уведомления</h2>
        <p className={s.subtitle}>
          Выберите события, о которых хотите получать письма. Настройки сохраняются автоматически.
        </p>
      </header>

      <ul className={s.list}>
        {descriptors.map((item) => (
          <li key={item.key} className={s.row}>
            <Switch
              id={`pref-${item.key}`}
              checked={preferences[item.key]}
              onChange={(next) => void handleToggle(item.key, next)}
              label={item.label}
              description={item.description}
              disabled={savingKey === item.key}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
