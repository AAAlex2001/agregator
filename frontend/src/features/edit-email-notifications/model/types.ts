import type { EmailPreferences, UserRole } from "@/entities/user";

/** Событие, его подпись в настройках и роли получателей писем. */
export interface EmailEvent {
  key: keyof EmailPreferences;
  label: string;
  description: string;
  roles: UserRole[];
}

/** Общая блокировка секции при сохранении соседних настроек. */
export interface EmailNotificationsOptions {
  disabled?: boolean;
  onBusyChange?: (isBusy: boolean) => void;
}
