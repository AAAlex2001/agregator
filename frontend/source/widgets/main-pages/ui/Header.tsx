"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { LogoIcon } from "@/source/shared/ui/icons";
import BurgerMenu from "./BurgerMenu";
import { scrollToAnchor } from "../lib/scrollToAnchor";
import styles from "./header.module.scss";

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
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.logo}>
            <LogoIcon />
          </span>
        </div>
        <nav className={styles.nav}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={(e) => handleSmoothScroll(e, link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <Link href="/login" className={styles.login}> Войти
          </Link>
          <Link href="/register" className={styles.signUp}>  Зарегистрироваться
          </Link>
        </div>
        <div className={styles.mobileActions}>
          <Link href="/login" className={styles.mobileLogin}>Войти</Link>
          <BurgerMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;

