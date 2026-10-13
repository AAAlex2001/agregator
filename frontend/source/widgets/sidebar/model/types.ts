import type { ComponentType } from "react";

export interface SidebarItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export interface SidebarSection {
  label: string;
  items: SidebarItem[];
}
