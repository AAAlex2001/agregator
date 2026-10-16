import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Нижняя информация левой колонки: готовый блок или подпись со значением. */
interface CardBottomInfoProps {
  label?: string;
  value?: ReactNode;
  custom?: ReactNode;
}

/** Отдаёт приоритет готовому блоку, а для пустого значения выводит прочерк. */
export function CardBottomInfo({ label, value, custom }: CardBottomInfoProps) {
  if (custom) {
    return <div className={styles.bottomLeft}>{custom}</div>;
  }

  if (!label) {
    return null;
  }

  return (
    <div className={styles.bottomLeft}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value ?? "—"}</span>
    </div>
  );
}
