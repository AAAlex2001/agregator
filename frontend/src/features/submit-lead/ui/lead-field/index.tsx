import cn from "classnames";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

/** Подпись поля заявки и его ширина в сетке формы. */
interface LeadFieldProps {
  label: string;
  children: ReactNode;
  wide?: boolean;
  as?: "label" | "div";
}

/** Размещает подпись над полем, сохраняя общие отступы заявки. */
export function LeadField({
  label,
  children,
  wide = false,
  as: Tag = "label",
}: LeadFieldProps) {
  return (
    <Tag
      className={cn(styles.field, {
        [styles.fieldWide]: wide,
      })}
    >
      <span className={styles.label}>{label}</span>
      {children}
    </Tag>
  );
}
