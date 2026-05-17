"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoIcon } from "@/source/shared/ui/icons";
import s from "./burgerMenu.module.scss";

const NAV_PAGES = [
  { href: "/orders", label: "Заявки" },
  { href: "/news", label: "Новости" },
  { href: "/blog", label: "Блог" },
  { href: "/reviews", label: "Отзывы" },
] as const;

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

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
        <nav className={`${s.menu} ${isOpen ? s.menuOpen : ""}`}>
          <div className={s.menuHeader}>
            <div className={s.menuLogo}>
              <LogoIcon />
            </div>
          </div>
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
      )}
    </>
  );
};

export default BurgerMenu;
