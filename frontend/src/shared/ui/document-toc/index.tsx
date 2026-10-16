import cn from "classnames";
import Link from "next/link";
import styles from "./style.module.scss";

/** Ссылка на именованный раздел документа. */
export interface DocumentTocItem {
  id: string;
  num: string;
  label: string;
}

/** Пункты оглавления и дополнительное оформление навигации. */
interface DocumentTocProps {
  items: DocumentTocItem[];
  className?: string;
}

/** Показывает оглавление со ссылками на якоря разделов. */
export function DocumentToc({ items, className }: DocumentTocProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav className={cn(styles.nav, className)}>
      <div className={styles.card}>
        <h3 className={styles.title}>Оглавление</h3>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`#${item.id}`}
                className={styles.link}
              >
                <span className={styles.num}>{item.num}</span>
                <span className={styles.label}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
