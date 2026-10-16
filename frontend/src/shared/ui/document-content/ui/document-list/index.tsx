import type { DocumentListItem } from "../../model/types";
import styles from "./style.module.scss";

/** Номер пункта документа и содержимое его маркированного списка. */
interface DocumentListProps {
  number: string;
  items: DocumentListItem[];
}

/** Показывает пункт документа с основным и вложенным списками. */
export function DocumentList({ number, items }: DocumentListProps) {
  return (
    <div className={styles.row}>
      <span className={styles.num}>{number}</span>
      <div className={styles.bulletColumn}>
        <ul className={styles.bulletList}>
          {items.map((item, index) => (
            <li
              key={index}
              className={styles.bulletListItem}
            >
              <p className={styles.bulletItemText}>{item.text}</p>
              {item.subitems && item.subitems.length > 0 && (
                <ul className={styles.subBulletList}>
                  {item.subitems.map((line, lineIndex) => (
                    <li
                      key={lineIndex}
                      className={styles.subBulletListItem}
                    >
                      <p className={styles.bulletItemText}>{line}</p>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
