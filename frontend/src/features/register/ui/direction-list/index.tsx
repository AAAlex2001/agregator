import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Направления, расположенные в исходном порядке регистрации. */
interface DirectionListProps {
  children: ReactNode;
}

/** Объединяет варианты направлений в один список. */
export function DirectionList({ children }: DirectionListProps) {
  return <ul className={styles.list}>{children}</ul>;
}

