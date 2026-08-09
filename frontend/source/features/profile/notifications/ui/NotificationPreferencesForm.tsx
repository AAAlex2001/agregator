"use client";

import { useRef, useState } from "react";
import { Switch } from "@/source/shared/ui/Switch";
import { FormSection } from "@/source/shared/ui";
import { useNotifications } from "@/source/shared/ui/Notifications";
import Button from "@/source/shared/ui/Button";
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
} from "../model/types";
import { OrderNotificationTypesPicker } from "./OrderNotificationTypesPicker";
import s from "./NotificationPreferencesForm.module.scss";

interface Props {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile | null) => void;
}

const SAVE_DEBOUNCE_MS = 400;

const ALL_PREFERENCE_KEYS: NotificationPreferenceKey[] = NOTIFICATION_DESCRIPTORS.map(
  (item) => item.key,
);

function relevantDescriptors(role: string): NotificationPreferenceDescriptor[] {
  if (role !== "CUSTOMER" && role !== "EXPERT") {
    return [];
  }
  return NOTIFICATION_DESCRIPTORS.filter((item) => item.roles.includes(role));
}

export function NotificationPreferencesForm({ profile, onProfileUpdate }: Props) {
  if (profile.role === "LICENSE_HOLDER") {
    return <LicenseHolderNotificationPreferences />;
  }

  return (
    <EditableNotificationPreferencesForm
      profile={profile}
      onProfileUpdate={onProfileUpdate}
    />
  );
}

function EditableNotificationPreferencesForm({
  profile,
  onProfileUpdate,
}: Props) {
  const {
    preferences,
    savingKey,
    toggle,
    setPreferences,
  } = useEmailPreferences(profile);
  const { showError, showSuccess } = useNotifications();
  const descriptors = relevantDescriptors(profile.role);
  const isExpert = profile.role === "EXPERT";

  const [orderCodes, setOrderCodes] = useState<string[]>(
    profile.notify_order_types ?? [],
  );
  const [savingTypes, setSavingTypes] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [pickerResetSeq, setPickerResetSeq] = useState(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const persistedOrderCodesRef = useRef<string[]>(
    profile.notify_order_types ?? [],
  );

  const handleToggle = async (
    key: NotificationPreferenceKey,
    next: boolean,
  ) => {
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

  const persistCodes = async (next: string[]) => {
    setSavingTypes(true);
    try {
      const updated = await updateOrderNotifications(next);
      const savedCodes = updated.notify_order_types ?? [];
      persistedOrderCodesRef.current = savedCodes;
      onProfileUpdate(updated);
      setOrderCodes(savedCodes);
      showSuccess(
        next.length
          ? "Фильтр уведомлений сохранён"
          : "Уведомления о новых заказах отключены",
      );
    } catch (error) {
      setOrderCodes(persistedOrderCodesRef.current);
      setPickerResetSeq((seq) => seq + 1);
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить",
      );
    } finally {
      setSavingTypes(false);
    }
  };

  const handleCodesChange = (next: string[]) => {
    setOrderCodes(next);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null;
      void persistCodes(next);
    }, SAVE_DEBOUNCE_MS);
  };

  const handleClearAll = async () => {
    if (resetting || savingTypes) return;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    const previousPreferences = preferences;
    const previousCodes = persistedOrderCodesRef.current;
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
      if (codesResult) {
        persistedOrderCodesRef.current = codesResult.notify_order_types ?? [];
      }
      onProfileUpdate(latest);
      showSuccess("Все почтовые уведомления отключены");
    } catch (error) {
      setPreferences(previousPreferences);
      setOrderCodes(previousCodes);
      setPickerResetSeq((seq) => seq + 1);
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось отключить уведомления",
      );
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
          disabled={savingTypes || resetting}
        >
          Отключить все
        </Button>
      </header>

      {isExpert && (
        <FormSection
          title="Новые заказы"
          hint="Уведомление придёт только по заказам, попадающим под ваши требования. Пока ничего не выбрано, уведомления о новых заказах не приходят."
          collapsible
        >
          <OrderNotificationTypesPicker
            key={pickerResetSeq}
            value={orderCodes}
            onChange={handleCodesChange}
            disabled={savingTypes || resetting}
          />
        </FormSection>
      )}

      <FormSection
        title="События по заявкам"
        hint="Отклики, изменения, сообщения и другие письма по вашим заявкам."
        collapsible
      >
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
      </FormSection>
    </div>
  );
}

function LicenseHolderNotificationPreferences() {
  return (
    <div className={s.form}>
      <header className={s.headerText}>
        <h2 className={s.title}>Почтовые уведомления</h2>
        <p className={s.subtitle}>
          Уведомления о новых заявках исполнителей включены всегда.
        </p>
      </header>

      <div className={s.fixedPreference}>
        <Switch
          id="pref-email-on-labor-listing"
          checked
          onChange={() => undefined}
          label="Новые заявки исполнителей"
          description="Новые объявления исполнителей о готовности к трудоустройству."
          disabled
        />
      </div>
    </div>
  );
}
