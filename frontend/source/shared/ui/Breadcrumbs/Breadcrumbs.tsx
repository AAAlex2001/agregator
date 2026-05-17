import Link from "next/link";
import { Fragment } from "react";
import styles from "./Breadcrumbs.module.scss";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: Props) {
  if (items.length === 0) return null;
  const cls = className ? `${styles.nav} ${className}` : styles.nav;

  return (
    <nav className={cls} aria-label="Хлебные крошки">
      <ol className={styles.list}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <Fragment key={`${item.label}-${idx}`}>
              <li className={styles.item}>
                {item.href && !isLast ? (
                  <Link href={item.href} className={styles.link}>{item.label}</Link>
                ) : (
                  <span className={styles.current} aria-current={isLast ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast ? <li className={styles.sep} aria-hidden="true">/</li> : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
