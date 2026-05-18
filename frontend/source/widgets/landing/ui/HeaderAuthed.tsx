"use client";

import Link from "next/link";
import { useState } from "react";
import s from "./header-authed.module.scss";

const NAV_PAGES = [
  { href: "/landing/news", label: "Новости" },
  { href: "/landing/blog", label: "Блог" },
  { href: "/landing/reviews", label: "Отзывы" },
] as const;

const HeaderAuthed = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={s.header}>
      <div className={s.container}>
        <nav className={s.nav} aria-label="Основная навигация">
          {NAV_PAGES.map((page) => (
            <Link key={page.href} href={page.href} className={s.navLink}>
              {page.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className={`${s.burger} ${open ? s.burgerOpen : ""}`}
          onClick={() => setOpen((p) => !p)}
          aria-label="Открыть меню"
          aria-expanded={open}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {open && (
        <nav className={s.mobileMenu} aria-label="Мобильное меню">
          {NAV_PAGES.map((page) => (
            <Link key={page.href} href={page.href} className={s.mobileLink} onClick={close}>
              {page.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default HeaderAuthed;
