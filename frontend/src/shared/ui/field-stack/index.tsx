import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Поля, которые нужно расположить в одну колонку. */
interface FieldStackProps {
  children: ReactNode;
}

/** Располагает поля формы вертикально с одинаковым расстоянием. */
export function FieldStack({ children }: FieldStackProps) {
  return <div className={styles.stack}>{children}</div>;
}
