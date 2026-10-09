import type { ReactNode } from "react";
import styles from "./style.module.scss";

type ListProps = {
  children: ReactNode;
};

/** Список карточек-строк. Строки — ListRow. */
const List = ({ children }: ListProps) => <ul className={styles.list}>{children}</ul>;

export default List;
