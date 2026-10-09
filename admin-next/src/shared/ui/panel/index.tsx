import type { ReactNode } from "react";
import styles from "./style.module.scss";

type PanelProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
};

/** Блок-карточка с заголовком. Справа от заголовка может стоять кнопка или счётчик. */
const Panel = ({ title, children, action }: PanelProps) => (
  <section className={styles.panel}>
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {action}
    </div>

    {children}
  </section>
);

export default Panel;
