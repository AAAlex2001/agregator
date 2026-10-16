import cn from "classnames";
import Link from "next/link";
import { Fragment } from "react";
import styles from "./style.module.scss";

/** Страница в цепочке навигации; текущему пункту ссылка не нужна. */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Цепочка страниц и дополнительное оформление навигации. */
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/** Показывает путь к странице и отмечает последний пункт как текущий. */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(styles.nav, className)}
      aria-label="Хлебные крошки"
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li className={styles.item}>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className={styles.link}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={styles.current}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>

              {!isLast && (
                <li
                  className={styles.sep}
                  aria-hidden="true"
                >
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
