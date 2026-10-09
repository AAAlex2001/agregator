import type { ReactNode } from "react";
import styles from "./style.module.scss";

type PageProps = {
  children: ReactNode;
};

/** Корень страницы админки: вертикальная колонка блоков с одинаковым отступом. */
const Page = ({ children }: PageProps) => <section className={styles.page}>{children}</section>;

export default Page;
