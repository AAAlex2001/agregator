import cn from "classnames";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Подпись, значок и действие одной вкладки нижней панели. */
interface MenuTabProps {
  label: string;
  icon: ReactNode;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
}

/** Показывает ссылку раздела или кнопку открытия панели. */
export function MenuTab({
  label,
  icon,
  isActive = false,
  href,
  onClick,
}: MenuTabProps) {
  const className = cn(styles.tab, {
    [styles.tabActive]: isActive,
  });
  const content = (
    <>
      <span
        className={styles.icon}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className={styles.text}>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        aria-current={isActive ? "page" : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
