"use client";

import { useState } from "react";
import { Switch } from "@/source/shared/ui/Switch";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { TypesPicker, type ExpertiseType } from "@/source/entities/expertise";
import type { UserProfile } from "@/source/entities/user";
import { updateOrderNotifications } from "../api/notifications.api";
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
  const isExpert = profile.role === "EXPERT";

  const [orderTypes, setOrderTypes] = useState<ExpertiseType[]>(
    (profile.notify_order_types ?? []) as ExpertiseType[],
  );
  const [savingTypes, setSavingTypes] = useState(false);

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

  const handleTypesChange = async (next: ExpertiseType[]) => {
    const previous = orderTypes;
    setOrderTypes(next);
    setSavingTypes(true);
    try {
      const updated = await updateOrderNotifications(next);
      onProfileUpdate(updated);
      setOrderTypes((updated.notify_order_types ?? []) as ExpertiseType[]);
      showSuccess(
        next.length
          ? "Фильтр уведомлений сохранён"
          : "Уведомления о новых заказах отключены",
      );
    } catch (error) {
      setOrderTypes(previous);
      showError(error instanceof Error ? error.message : "Не удалось сохранить");
    } finally {
      setSavingTypes(false);
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

      {isExpert && (
        <section className={s.orderTypes}>
          <h3 className={s.title}>Новые заказы</h3>
          <p className={s.subtitle}>
            Отметьте типы экспертизы — письмо придёт, когда появится заказ с такими обозначениями.
            Пока ничего не выбрано, письма о новых заказах не приходят.
          </p>
          <div className={savingTypes ? s.pickerSaving : ""}>
            <TypesPicker value={orderTypes} onChange={(next) => void handleTypesChange(next)} />
          </div>
        </section>
      )}

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
