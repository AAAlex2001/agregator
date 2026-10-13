import cn from "classnames";
import Link from "next/link";
import type { SidebarItem } from "../model/types";
import s from "./Sidebar.module.scss";

interface SidebarLinkProps {
  item: SidebarItem;
  active: boolean;
  badge?: number;
  onNavigate: () => void;
}

/** Отображает пункт меню с активным состоянием и счётчиком уведомлений. */
export function SidebarLink({ item, active, badge = 0, onNavigate }: SidebarLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(s.tab, { [s.tabActive]: active })}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
    >
      <span className={s.tabIcon} aria-hidden="true"><Icon /></span>
      <span className={s.tabLabel}>{item.label}</span>
      {badge > 0 && <span className={s.badge}>{badge > 99 ? "99+" : badge}</span>}
    </Link>
  );
}
