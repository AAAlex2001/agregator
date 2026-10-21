import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Заголовок блока и его содержимое. */
interface OrderPanelProps {
  title: string;
  children: ReactNode;
}

/** Блок страницы заявки в рамке. */
export function OrderPanel({ title, children }: OrderPanelProps) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  );
}
