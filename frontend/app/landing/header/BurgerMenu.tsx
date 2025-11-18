"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./burgerMenu.module.scss";

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const headerHeight = 450;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
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
        <nav className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}>
            <Link
              href="#how-it-works"
              onClick={(e) => handleSmoothScroll(e, "#how-it-works")}
              className={styles.menuLink}
            >
              Как это работает
            </Link>
            <Link
              href="#advantages"
              onClick={(e) => handleSmoothScroll(e, "#advantages")}
              className={styles.menuLink}
            >
              Преимущества
            </Link>
            <Link
              href="#reviews"
              onClick={(e) => handleSmoothScroll(e, "#reviews")}
              className={styles.menuLink}
            >
              Отзывы
            </Link>
            <Link
              href="#faq"
              onClick={(e) => handleSmoothScroll(e, "#faq")}
              className={styles.menuLink}
            >
              FAQ
            </Link>
            <div className={styles.menuActions}>
              <button className={styles.menuLogin}>Войти</button>
              <button className={styles.menuSignUp}>Зарегистрироваться</button>
            </div>
          </nav>
      )}
    </>
  );
};

export default BurgerMenu;

