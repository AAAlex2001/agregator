import type { ReactNode } from "react";

/** Действия авторизации и место для навигационной цепочки под публичной шапкой. */
export interface SiteHeaderProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  breadcrumbs?: ReactNode;
}

/** Ссылка основного меню публичных страниц. */
export interface HeaderLink {
  href: string;
  label: string;
}

/** Возможность платформы, доступная гостю только для ознакомления. */
export interface GuestCapability {
  id: string;
  label: string;
  color: "indigo" | "amber" | "green" | "red" | "gold";
  hasSubmenu: boolean;
  logo?: boolean;
}

/** Значок направления в бегущей строке шапки. */
export type DirectionIconName =
  | "helmet"
  | "shield"
  | "gauge"
  | "ruler"
  | "compass"
  | "leaf"
  | "flask"
  | "map"
  | "scales";

/** Направление работы со ссылкой на публичную страницу услуги. */
export interface HeaderDirection {
  href: string;
  label: string;
  icon: DirectionIconName;
}
