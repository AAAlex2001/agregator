import cn from "classnames";
import type { ReactNode } from "react";
import { Checkbox } from "@/shared/ui/checkbox";
import styles from "./style.module.scss";

/** Выбор направления и дополнительные поля при регистрации. */
interface DirectionOptionProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  note?: string;
  children?: ReactNode;
}

/** Открывает анкету выбранного направления под его описанием. */
export function DirectionOption({
  id,
  title,
  description,
  checked,
  onToggle,
  note,
  children,
}: DirectionOptionProps) {
  return (
    <li className={cn(styles.item, { [styles.itemActive]: checked })}>
      <Checkbox
        id={`direction-${id}`}
        checked={checked}
        onChange={onToggle}
        className={styles.checkbox}
      >
        <span className={styles.title}>{title}</span>
        <span className={styles.text}>{description}</span>
      </Checkbox>

      {checked && (
        <div className={styles.body}>
          {children}
          {note && <span className={styles.text}>{note}</span>}
        </div>
      )}
    </li>
  );
}

