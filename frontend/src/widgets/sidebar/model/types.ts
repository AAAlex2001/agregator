import type { ComponentType } from "react";

/** Ссылка меню, маршруты, на которых она остаётся выделенной, и плашка вроде «Новое». */
export interface SidebarItem {
  href: string;
  activePaths?: string[];
  label: string;
  tag?: string;
  icon: ComponentType<{ className?: string }>;
}

/** Подписанная группа ссылок кабинета. */
export interface SidebarSection {
  label: string;
  items: SidebarItem[];
}
