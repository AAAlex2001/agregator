"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { LogoIcon } from "@/source/shared/ui/icons";
import BurgerMenu from "./BurgerMenu";
import { scrollToAnchor } from "../lib/scrollToAnchor";
import s from "./header.module.scss";

const NAV_LINKS = [
  { anchor: "#how-it-works", label: "Как это работает" },
  { anchor: "#advantages", label: "Преимущества" },
  { anchor: "#reviews", label: "Отзывы" },
  { anchor: "#faq", label: "FAQ" },
] as const;

const Header = () => {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>, anchor: string) => {
    if (isLanding) {
      e.preventDefault();
      scrollToAnchor(anchor);
    }
  };

  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link href="/" className={s.brand} aria-label="На главную">
          <span className={s.logo}>
            <LogoIcon />
          </span>
        </Link>
        <nav className={s.nav}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.anchor}
              href={`/${link.anchor}`}
              onClick={(e) => handleAnchorClick(e, link.anchor)}
            >
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
