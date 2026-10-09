import cn from "classnames";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./style.module.scss";

type ListRowProps = {
  children: ReactNode;
  href?: string;
  className?: string;
};

/** Карточка-строка списка. С href вся строка ведёт на страницу записи. */
const ListRow = ({ children, href, className }: ListRowProps) => (
  <li>
    {href ? (
      <Link className={cn(styles.row, styles.link, className)} href={href}>
        {children}
      </Link>
    ) : (
      <div className={cn(styles.row, className)}>{children}</div>
    )}
  </li>
);

export default ListRow;
