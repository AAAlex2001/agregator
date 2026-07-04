"use client";

import Link from "next/link";
import { LogoIcon } from "@/source/shared/ui/icons";
import BurgerMenu from "./BurgerMenu";
import s from "./header.module.scss";

const NAV_PAGES = [
  { href: "/orders", label: "Заявки" },
  { href: "/news", label: "Новости" },
  { href: "/blog", label: "Блог" },
  { href: "/reviews", label: "Отзывы" },
] as const;

const Header = () => {
  return (
    <>
      <header className={s.header}>
        <div className={s.container}>
          <Link href="/" className={s.brand} aria-label="На главную">
            <span className={s.logo}>
              <LogoIcon />
            </span>
          </Link>
          <nav className={s.nav}>
            {NAV_PAGES.map((page) => (
              <Link key={page.href} href={page.href}>
                {page.label}
              </Link>
            ))}
          </nav>
          <div className={s.actions}>
            <Link href="/login" className={s.login}> Войти
            </Link>
            <Link href="/register" className={s.signUp}>  Зарегистрироваться
            </Link>
          </div>
          <div className={s.mobileActions}>
            <Link href="/login" className={s.mobileLogin}>Войти</Link>
            <BurgerMenu />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
