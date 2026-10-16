"use client";

import type { UserProfile } from "@/entities/user";
import { FormSection } from "@/shared/ui/form-section";
import type { EmailNotificationsOptions } from "../../model/types";
import { useEditEmailNotifications } from "../../model/use-edit-email-notifications";
import { EmailEventSwitch } from "../email-event-switch";
import styles from "./style.module.scss";

/** Профиль с текущими настройками и блокировка соседних действий. */
interface EmailNotificationsFormProps extends EmailNotificationsOptions {
  profile: UserProfile;
}

/** Показывает события для роли пользователя и сохраняет каждое переключение. */
export function EmailNotificationsForm({
  profile,
  disabled = false,
  onBusyChange,
}: EmailNotificationsFormProps) {
  const { events, isSaving, changeEvent } = useEditEmailNotifications(profile, {
    disabled,
    onBusyChange,
  });

  return (
    <FormSection
      title="События по заявкам"
      hint="Отклики, изменения, сообщения и другие письма по вашим заявкам."
      collapsible
    >
      <ul className={styles.list}>
        {events.map((event) => (
          <EmailEventSwitch
            key={event.key}
            event={event}
            checked={profile.email_preferences[event.key]}
            disabled={disabled || isSaving}
            onChange={changeEvent}
          />
        ))}
      </ul>
    </FormSection>
  );
}
