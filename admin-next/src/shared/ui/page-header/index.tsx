import type { ReactNode } from "react";
import Button from "@/shared/ui/button";
import { ArrowLeftIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  backHref?: string;
};

/** Шапка страницы: заголовок, пояснение и действие справа. С backHref — ссылка «Назад» сверху. */
const PageHeader = ({ title, description, action, backHref }: PageHeaderProps) => (
  <header className={styles.header}>
    {backHref && (
      <Button className={styles.back} variant="ghost" size="sm" href={backHref}>
        <ArrowLeftIcon />
        Назад
      </Button>
    )}

    <div className={styles.row}>
      <div className={styles.texts}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {action}
    </div>
  </header>
);

export default PageHeader;
