import cn from "classnames";
import type { ListCardItem } from "../../model/types";
import styles from "./style.module.scss";

/** Упорядоченные свойства в правой колонке карточки. */
interface CardPropertiesProps {
  items: ListCardItem[];
}

/** Показывает значения с заданным размером и цветовым акцентом. */
export function CardProperties({ items }: CardPropertiesProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles.right}>
      {items.map((item, index) => (
        <div
          key={index}
          className={styles.rightItem}
        >
          <span className={styles.label}>{item.label}</span>
          <span
            className={cn(styles.value, {
              [styles.valueAccent]: item.valueAccent,
              [styles.valueOrange]: item.valueOrange,
            })}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
