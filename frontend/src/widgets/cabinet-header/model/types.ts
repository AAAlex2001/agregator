import type { ChatUnreadCounts } from "@/entities/chat";
import type { UserRole } from "@/entities/user";

/** Внешняя ссылка в региональном списке поверки приборов. */
export interface HeaderRegionLink {
  label: string;
  href: string;
}

/** Организации поверки приборов в одном регионе. */
export interface HeaderRegion {
  region: string;
  links: HeaderRegionLink[];
}

/** Ссылка, будущий сервис или региональный список в разделе шапки. */
export interface HeaderNavigationItem {
  label: string;
  href?: string;
  external?: boolean;
  soon?: boolean;
  description?: string;
  logoSrc?: string;
  logoAlt?: string;
  regions?: HeaderRegion[];
  badge?: keyof ChatUnreadCounts;
}

/** Раздел площадки с доступными ролями и пунктами выпадающего меню. */
export interface HeaderNavigationSection {
  key: string;
  label: string;
  color: "indigo" | "amber" | "green" | "red" | "gold";
  dynamic?: "license";
  items?: HeaderNavigationItem[];
  roles?: UserRole[];
  href?: string;
  logo?: boolean;
  badge?: keyof ChatUnreadCounts;
}
