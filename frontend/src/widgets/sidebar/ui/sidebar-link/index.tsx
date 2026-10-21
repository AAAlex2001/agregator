import cn from "classnames";
import Link from "next/link";
import type { SidebarItem } from "../../model/types";
import styles from "./style.module.scss";

/** Пункт меню с текущим маршрутом и необязательным счётчиком. */
interface SidebarLinkProps {
  item: SidebarItem;
  pathname: string;
  badge: number;
  onNavigate: () => void;
}

/** Выделяет ссылку на текущий раздел и показывает число уведомлений. */
export function SidebarLink({
  item,
  pathname,
  badge,
  onNavigate,
}: SidebarLinkProps) {
  const Icon = item.icon;
  const activePaths = item.activePaths ?? [item.href];
  const isActive = activePaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  return (
    <Link
      href={item.href}
      className={cn(styles.tab, {
        [styles.tabActive]: isActive,
      })}
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
    >
      <span
        className={styles.tabIcon}
        aria-hidden="true"
      >
        <Icon />
      </span>
      <span className={styles.tabLabel}>{item.label}</span>
      {item.tag && <span className={styles.tag}>{item.tag}</span>}
      {badge > 0 && (
        <span className={styles.badge}>{badge > 99 ? "99+" : badge}</span>
      )}
    </Link>
  );
}
