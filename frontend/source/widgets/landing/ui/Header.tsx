"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { LogoIcon } from "@/source/shared/ui/icons";
import BurgerMenu from "./BurgerMenu";
import { scrollToAnchor } from "../lib/scrollToAnchor";
import s from "./header.module.scss";

const NAV_LINKS = [
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#advantages", label: "Преимущества" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#faq", label: "FAQ" },
] as const;

const Header = () => {
  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToAnchor(href);
  };

  return (
    <header className={s.header}>
      <div className={s.container}>
        <div className={s.brand}>
          <span className={s.logo}>
            <LogoIcon />
          </span>
        </div>
        <nav className={s.nav}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={(e) => handleSmoothScroll(e, link.href)}>
              {link.label}
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
  );
};

export default Header;

