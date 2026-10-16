import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Подпись и значение реквизита в карточке держателя документов. */
interface LicenseHolderFieldProps {
  label: string;
  children: ReactNode;
}

/** Выводит отдельный реквизит с подписью над значением. */
export function LicenseHolderField({
  label,
  children,
}: LicenseHolderFieldProps) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
    </div>
  );
}
