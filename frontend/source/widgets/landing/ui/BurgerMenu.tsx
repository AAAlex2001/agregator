"use client";

import type { MouseEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { LogoIcon } from "@/source/shared/ui/icons";
import { scrollToAnchor } from "../lib/scrollToAnchor";
import s from "./burgerMenu.module.scss";

const NAV_LINKS = [
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#advantages", label: "Преимущества" },
  { href: "#faq", label: "FAQ" },
] as const;

const NAV_PAGES = [
  { href: "/orders", label: "Заявки" },
  { href: "/reviews", label: "Отзывы" },
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
        className={`${s.burgerButton} ${isOpen ? s.open : ""}`}
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
          <nav className={`${s.menu} ${isOpen ? s.menuOpen : ""}`}>
            <div className={s.menuHeader}>
              <div className={s.menuLogo}>
                <LogoIcon />
              </div>
            </div>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className={s.menuLink}
              >
                {link.label}
              </Link>
            ))}
            {NAV_PAGES.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                onClick={closeMenu}
                className={s.menuLink}
              >
                {page.label}
              </Link>
            ))}
            <div className={s.menuActions}>
              <Link href="/register" className={s.menuSignUp} onClick={closeMenu}>Зарегистрироваться</Link>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default BurgerMenu;

