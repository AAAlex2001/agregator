import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import type { HeaderNavigationItem } from "../../model/types";
import styles from "./style.module.scss";

/** Сервис в мобильном меню и закрытие меню при переходе. */
interface MobileItemProps {
  item: HeaderNavigationItem;
  onNavigate: () => void;
}

/** Показывает описание сервиса с внутренней или внешней ссылкой. */
export function MobileItem({ item, onNavigate }: MobileItemProps) {
  const content = (
    <span className={styles.subRow}>
      {item.logoSrc && (
        <Image
          src={item.logoSrc}
          alt={item.logoAlt ?? ""}
          width={90}
          height={55}
          className={styles.subLogo}
        />
      )}
      <span className={styles.subCopy}>
        <span className={styles.subHead}>
          <span className={styles.subLabel}>{item.label}</span>
          {item.soon && <span className={styles.soon}>в&nbsp;процессе</span>}
        </span>
        {item.description && <span className={styles.subDesc}>{item.description}</span>}
      </span>
    </span>
  );

  if (item.soon || !item.href) {
    return <span className={cn(styles.subLink, styles.subMuted)}>{content}</span>;
  }

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.subLink}
        onClick={onNavigate}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      className={styles.subLink}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}
