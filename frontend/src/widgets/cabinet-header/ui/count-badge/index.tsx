import styles from "./style.module.scss";

/** Число непрочитанных сообщений одного раздела. */
interface CountBadgeProps {
  count: number;
}

/** Скрывает пустой счётчик и ограничивает его подпись значением 99+. */
export function CountBadge({ count }: CountBadgeProps) {
  if (count <= 0) {
    return null;
  }

  return <span className={styles.navBadge}>{count > 99 ? "99+" : count}</span>;
}
