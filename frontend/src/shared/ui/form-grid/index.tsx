import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Содержимое адаптивной сетки полей. */
interface FormGridProps {
  children: ReactNode;
}

/** Поля в одну колонку на телефоне и в две колонки на широком экране. */
export function FormGrid({ children }: FormGridProps) {
  return <div className={styles.grid}>{children}</div>;
}
