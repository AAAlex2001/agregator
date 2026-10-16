import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Страница чата исполнителей. */
interface ExpertRoomLayoutProps {
  children: ReactNode;
}

/** Растягивает чат на высоту экрана между шапкой и нижними вкладками кабинета. */
export function ExpertRoomLayout({ children }: ExpertRoomLayoutProps) {
  return (
    <div className={styles.body}>
      <div className={styles.pane}>{children}</div>
    </div>
  );
}
