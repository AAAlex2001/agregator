import type { ReactNode } from "react";
import { ChevronIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Заголовок группы фильтров, количество выбранных значений и её поля. */
interface FilterSectionProps {
  title: string;
  count: number;
  children: ReactNode;
}

/** Сворачивает одну группу фильтров и показывает количество выбранных пунктов. */
export function FilterSection({ title, count, children }: FilterSectionProps) {
  return (
    <details className={styles.section}>
      <summary className={styles.summary}>
        <span className={styles.heading}>
          {title}
          {count > 0 && <span className={styles.count}>{count}</span>}
        </span>
        <ChevronIcon
          className={styles.chevron}
          color="var(--color-comment-date)"
        />
      </summary>
      {children}
    </details>
  );
}
