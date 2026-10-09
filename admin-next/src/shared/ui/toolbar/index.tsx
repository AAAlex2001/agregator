import type { ReactNode } from "react";
import styles from "./style.module.scss";

type ToolbarProps = {
  children: ReactNode;
  aside?: ReactNode;
};

/** Полоса фильтров над списком. aside прижимается к правому краю — например, счётчик. */
const Toolbar = ({ children, aside }: ToolbarProps) => (
  <div className={styles.toolbar}>
    <div className={styles.controls}>{children}</div>
    {aside && <div className={styles.aside}>{aside}</div>}
  </div>
);

export default Toolbar;
