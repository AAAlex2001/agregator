"use client";

import Link from "next/link";
import { useSession } from "@/source/features/session";
import s from "./header-authed.module.scss";

const NAV_PAGES = [
  { href: "/landing/news", label: "Новости" },
  { href: "/landing/blog", label: "Блог" },
  { href: "/landing/reviews", label: "Отзывы" },
] as const;

const HeaderAuthed = () => {
  const { role } = useSession();

  return (
    <header className={s.header}>
      <nav className={s.nav} aria-label="Основная навигация">
        {NAV_PAGES.map((page) => (
          <Link key={page.href} href={page.href} className={s.navLink}>
            {page.label}
          </Link>
        ))}
        {role === "EXPERT" && (
          <Link href="/license-holders" className={`${s.navLink} ${s.desktopOnly} ${s.accent}`}>
            Держатели лицензий
          </Link>
        )}
      </nav>
    </header>
  );
};

export default HeaderAuthed;
