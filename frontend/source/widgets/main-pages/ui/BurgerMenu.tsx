"use client";

import type { MouseEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { LogoIcon } from "@/source/shared/ui/icons";
import { scrollToAnchor } from "../lib/scrollToAnchor";
import styles from "./burgerMenu.module.scss";

const NAV_LINKS = [
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#advantages", label: "Преимущества" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#faq", label: "FAQ" },
] as const;

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    scrollToAnchor(href);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className={`${styles.burgerButton} ${isOpen ? styles.open : ""}`}
        onClick={toggleMenu}
        aria-label="Открыть меню"
        aria-expanded={isOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && (
        <>
          <nav className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}>
            <div className={styles.menuHeader}>
              <div className={styles.menuLogo}>
                <LogoIcon />
              </div>
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className={styles.menuLink}
              >
                {link.label}
              </Link>
            ))}
            <div className={styles.menuActions}>
              <Link href="/register" className={styles.menuSignUp} onClick={closeMenu}>Зарегистрироваться</Link>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default BurgerMenu;

