import Link from "next/link";
import styles from "./DocToc.module.scss";

export type DocTocItem = {
  id: string;
  num: string;
  label: string;
};

export type DocTocProps = {
  items: readonly DocTocItem[];
  className?: string;
};

export function DocToc({ items, className }: DocTocProps) {
  if (items.length === 0) return null;

  const navClass = className ? `${styles.nav} ${className}` : styles.nav;

  return (
    <nav className={navClass}>
      <div className={styles.card}>
        <h3 className={styles.title}>Оглавление</h3>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`#${item.id}`} className={styles.link}>
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
