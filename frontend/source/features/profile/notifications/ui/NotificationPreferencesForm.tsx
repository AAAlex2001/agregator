"use client";

import { useRef, useState } from "react";
import { Switch } from "@/source/shared/ui/Switch";
import { useNotifications } from "@/source/shared/ui/Notifications";
import Button from "@/source/shared/ui/Button";
import { BadgeCodesPicker } from "@/source/entities/expertise";
import type { EmailPreferences, UserProfile } from "@/source/entities/user";
import {
  updateEmailPreferences,
  updateOrderNotifications,
} from "@/source/entities/user";
import { NOTIFICATION_DESCRIPTORS } from "../model/descriptors";
import { useEmailPreferences } from "../model/useEmailPreferences";
import type {
  NotificationPreferenceDescriptor,
  NotificationPreferenceKey,
  UpdateEmailPreferencesPayload,
} from "../model/types";
import s from "./NotificationPreferencesForm.module.scss";

interface Props {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile | null) => void;
}

const SAVE_DEBOUNCE_MS = 400;

const ALL_PREFERENCE_KEYS: NotificationPreferenceKey[] = [
  "email_on_response_created",
  "email_on_response_updated",
  "email_on_expert_rejected",
  "email_on_order_updated",
  "email_on_bidding_finished",
  "email_on_chat_message",
  "email_on_question_asked",
  "email_on_question_answered",
];

function relevantDescriptors(role: string): NotificationPreferenceDescriptor[] {
  if (role !== "CUSTOMER" && role !== "EXPERT") {
    return [];
  }
  return NOTIFICATION_DESCRIPTORS.filter((item) => item.roles.includes(role));
}

export function NotificationPreferencesForm({ profile, onProfileUpdate }: Props) {
  const { preferences, savingKey, toggle, setPreferences } = useEmailPreferences(profile);
  const { showError, showSuccess } = useNotifications();
  const descriptors = relevantDescriptors(profile.role);
  const isExpert = profile.role === "EXPERT";

  const [orderCodes, setOrderCodes] = useState<string[]>(profile.notify_order_types ?? []);
  const [savingTypes, setSavingTypes] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [pickerResetSeq, setPickerResetSeq] = useState(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const persistCodes = async (next: string[], previous: string[]) => {
    setSavingTypes(true);
    try {
      const updated = await updateOrderNotifications(next);
      onProfileUpdate(updated);
      setOrderCodes(updated.notify_order_types ?? []);
      showSuccess(
        next.length
          ? "Фильтр уведомлений сохранён"
          : "Уведомления о новых заказах отключены",
      );
    } catch (error) {
      setOrderCodes(previous);
      showError(error instanceof Error ? error.message : "Не удалось сохранить");
    } finally {
      setSavingTypes(false);
    }
  };

  const handleCodesChange = (next: string[]) => {
    const previous = orderCodes;
    setOrderCodes(next);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void persistCodes(next, previous);
    }, SAVE_DEBOUNCE_MS);
  };

  const handleClearAll = async () => {
    if (resetting) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    const previousPreferences = preferences;
    const previousCodes = orderCodes;
    const allOff = ALL_PREFERENCE_KEYS.reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as EmailPreferences,
    );

    setResetting(true);
    setPreferences(allOff);
    setOrderCodes([]);
    setPickerResetSeq((seq) => seq + 1);

    try {
      const [prefsResult, codesResult] = await Promise.all([
        updateEmailPreferences(allOff),
        isExpert ? updateOrderNotifications([]) : Promise.resolve(null),
      ]);
      const latest = codesResult ?? prefsResult;
      onProfileUpdate(latest);
      showSuccess("Все почтовые уведомления отключены");
    } catch (error) {
      setPreferences(previousPreferences);
      setOrderCodes(previousCodes);
      setPickerResetSeq((seq) => seq + 1);
      showError(error instanceof Error ? error.message : "Не удалось отключить уведомления");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className={s.form}>
      <header className={s.header}>
        <div className={s.headerText}>
          <h2 className={s.title}>Почтовые уведомления</h2>
          <p className={s.subtitle}>
            Выберите события, о которых хотите получать письма. Настройки сохраняются автоматически.
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          className={s.clearButton}
          onClick={() => void handleClearAll()}
          isLoading={resetting}
        >
          Отключить все
        </Button>
      </header>

      {isExpert && (
        <section className={s.orderTypes}>
          <h3 className={s.title}>Новые заказы</h3>
          <p className={s.subtitle}>
            Выберите типы и области экспертизы — письмо придёт только по заказам, попадающим под ваши требования.
            Пока ничего не выбрано, письма о новых заказах не приходят.
          </p>
          <div className={savingTypes ? s.pickerSaving : ""}>
            <BadgeCodesPicker
              key={pickerResetSeq}
              value={orderCodes}
              onChange={handleCodesChange}
            />
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
              disabled={savingKey === item.key || resetting}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
