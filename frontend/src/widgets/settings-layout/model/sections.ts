import type { UserRole } from "@/entities/user";

/** Вкладка страницы настроек, хранится в параметре section адреса. */
export type SettingsSection = "personal" | "notifications" | "subscription" | "referrals";

/** Вкладка настроек и её подпись. */
export interface SettingsTab {
  id: SettingsSection;
  label: string;
}

/** Вкладки, доступные каждой роли. */
const PROFILE_TABS: SettingsTab[] = [
  {
    id: "personal",
    label: "Личные данные",
  },
  {
    id: "notifications",
    label: "Уведомления",
  },
];

/** Вкладки исполнителя: ещё подписка и приглашения коллег. */
const EXPERT_TABS: SettingsTab[] = [
  ...PROFILE_TABS,
  {
    id: "subscription",
    label: "Подписка",
  },
  {
    id: "referrals",
    label: "Приглашения",
  },
];

/** Возвращает вкладки настроек, доступные роли. */
export function getSettingsTabs(role: UserRole | null): SettingsTab[] {
  return role === "EXPERT" ? EXPERT_TABS : PROFILE_TABS;
}

/** Выбирает доступную вкладку из адреса; по умолчанию открывает личные данные. */
export function resolveSettingsSection(
  value: string | null,
  role: UserRole | null,
): SettingsSection {
  return getSettingsTabs(role).find((tab) => tab.id === value)?.id ?? "personal";
}
