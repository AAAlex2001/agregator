import cn from "classnames";
import type { HeaderNavigationSection } from "../../model/types";
import styles from "./style.module.scss";

/** Раздел с обычной или двухстрочной подписью. */
interface SectionLabelProps {
  section: HeaderNavigationSection;
}

/** Сохраняет двухстрочную подпись списка держателей документов. */
export function SectionLabel({ section }: SectionLabelProps) {
  if (section.key === "license") {
    return (
      <span className={cn(styles.plateLabel, styles.plateLabelMultiline)}>
        <span>Держатели</span>
        <span>разрешительных документов</span>
      </span>
    );
  }

  return <span className={styles.plateLabel}>{section.label}</span>;
}
