import type { ReactNode } from "react";
import styles from "./style.module.scss";

type FieldGridProps = {
  children: ReactNode;
};

/** Сетка полей формы: одна колонка на телефоне, две — с планшета. */
const FieldGrid = ({ children }: FieldGridProps) => <div className={styles.grid}>{children}</div>;

export default FieldGrid;
