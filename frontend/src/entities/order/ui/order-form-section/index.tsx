import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Подпись и поля одного блока формы заказа. */
interface OrderFormSectionProps {
  label?: ReactNode;
  children: ReactNode;
}

/** Группирует поля заказа с общими отступами и необязательной подписью. */
export function OrderFormSection({ label, children }: OrderFormSectionProps) {
  return (
    <section className={styles.section}>
      {label && <span className={styles.label}>{label}</span>}
      {children}
    </section>
  );
}
