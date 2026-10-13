import type { ReactNode } from "react";
import { ChevronIcon } from "@/source/shared/ui/icons";
import s from "./FilterSection.module.scss";

interface FilterSectionProps {
  title: string;
  count: number;
  children: ReactNode;
}

/** Сворачиваемая секция фильтров; число рядом с заголовком — сколько значений выбрано. */
export function FilterSection({ title, count, children }: FilterSectionProps) {
  return (
    <details className={s.section}>
      <summary className={s.summary}>
        <span className={s.heading}>
          {title}
          {count > 0 && <span className={s.count}>{count}</span>}
        </span>
        <ChevronIcon className={s.chevron} color="#9aa1ad" />
      </summary>
      {children}
    </details>
  );
}
