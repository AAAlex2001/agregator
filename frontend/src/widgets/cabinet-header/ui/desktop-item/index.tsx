import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import type { ChatUnreadCounts } from "@/entities/chat";
import type { HeaderNavigationItem } from "../../model/types";
import { CountBadge } from "../count-badge";
import styles from "./style.module.scss";

/** Пункт меню с описанием, логотипом и необязательным счётчиком. */
interface DesktopItemProps {
  item: HeaderNavigationItem;
  badges: ChatUnreadCounts;
}

/** Сохраняет обычную ссылку для доступных сервисов и подпись для будущих. */
export function DesktopItem({ item, badges }: DesktopItemProps) {
  const content = (
    <span className={styles.itemRow}>
      {item.logoSrc && (
        <Image
          src={item.logoSrc}
          alt={item.logoAlt ?? ""}
          width={90}
          height={55}
          className={styles.itemLogo}
        />
      )}
      <span className={styles.itemCopy}>
        <span className={styles.itemHead}>
          <span className={styles.itemLabel}>{item.label}</span>
          {item.badge && <CountBadge count={badges[item.badge]} />}
          {item.soon && <span className={styles.soon}>в&nbsp;процессе</span>}
        </span>
        {item.description && <span className={styles.itemDesc}>{item.description}</span>}
      </span>
    </span>
  );

  if (item.soon || !item.href) {
    return <span className={cn(styles.item, styles.itemMuted)}>{content}</span>;
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.item}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={styles.item}
    >
      {content}
    </Link>
  );
}
