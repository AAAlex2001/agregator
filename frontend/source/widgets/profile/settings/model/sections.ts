import type { SessionRole } from "@/source/features/session";

export type SettingsSection = "personal" | "notifications" | "subscription" | "referrals";

export interface SettingsTab {
  id: SettingsSection;
  label: string;
}

const PROFILE_TABS: SettingsTab[] = [
  { id: "personal", label: "Личные данные" },
  { id: "notifications", label: "Уведомления" },
];

const EXPERT_TABS: SettingsTab[] = [
  ...PROFILE_TABS,
  { id: "subscription", label: "Подписка" },
  { id: "referrals", label: "Приглашения" },
];

/** Возвращает вкладки настроек, доступные выбранной роли. */
export function getSettingsTabs(role: SessionRole | null): SettingsTab[] {
  return role === "EXPERT" ? EXPERT_TABS : PROFILE_TABS;
}

/** Выбирает доступную вкладку из URL; по умолчанию открывает личные данные. */
export function resolveSettingsSection(value: string | null, role: SessionRole | null): SettingsSection {
  return getSettingsTabs(role).find((tab) => tab.id === value)?.id ?? "personal";
}
