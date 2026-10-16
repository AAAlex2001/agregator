import type { ComponentType } from "react";

/** Ссылка меню и маршруты, на которых она остаётся выделенной. */
export interface SidebarItem {
  href: string;
  activePaths?: string[];
  label: string;
  icon: ComponentType<{ className?: string }>;
}

/** Подписанная группа ссылок кабинета. */
export interface SidebarSection {
  label: string;
  items: SidebarItem[];
}
