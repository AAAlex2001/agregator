"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon } from "@/shared/ui/icons";
import { ADMIN_NAV } from "../../data";
import styles from "./style.module.scss";

type AdminNavProps = {
  onExit: () => void;
  onNavigate?: () => void;
};

const isUnder = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

/** Меню админки по разделам. Подсвечен самый точный раздел для текущего адреса. */
const AdminNav = ({ onExit, onNavigate }: AdminNavProps) => {
  const pathname = usePathname();
  const active = ADMIN_NAV.flatMap((group) => group.items)
    .filter((item) => isUnder(pathname, item.href))
    .sort((left, right) => right.href.length - left.href.length)[0]?.href;

  return (
    <nav className={styles.nav} aria-label="Разделы админки">
      {ADMIN_NAV.map((group) => (
        <div key={group.title} className={styles.group}>
          <span className={styles.title}>{group.title}</span>
          <ul className={styles.items}>
            {group.items.map(({ href, label, Icon }) => (
              <li key={href}>
                <Link className={cn(styles.item, href === active && styles.active)} href={href} onClick={onNavigate}>
                  <Icon className={styles.icon} />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button type="button" className={styles.exit} onClick={onExit}>
        <LogOutIcon className={styles.icon} />
        Выйти
      </button>
    </nav>
  );
};

export default AdminNav;
