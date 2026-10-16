"use client";

import cn from "classnames";
import { useState } from "react";
import Link from "next/link";
import { LogoIcon } from "@/shared/ui/icons";
import { HEADER_LINKS } from "../../config/navigation";
import { MobileCapabilities } from "../mobile-capabilities";
import styles from "./style.module.scss";

/** Действия авторизации из мобильного меню. */
interface MobileMenuProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

/** Открывает мобильную навигацию и закрывает её перед переходом или авторизацией. */
export function MobileMenu({ onOpenLogin, onOpenRegister }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCapabilities, setShowCapabilities] = useState(false);

  /** Открывает или закрывает мобильное меню. */
  function toggleMenu() {
    setIsOpen((previous) => !previous);
  }

  /** Закрывает меню после выбора ссылки. */
  function closeMenu() {
    setIsOpen(false);
    setShowCapabilities(false);
  }

  /** Открывает или сворачивает возможности, сохраняя выбор до перехода по ссылке. */
  function toggleCapabilities() {
    setShowCapabilities((previous) => !previous);
  }

  /** Закрывает меню и открывает форму входа. */
  function openLogin() {
    closeMenu();
    onOpenLogin();
  }

  /** Закрывает меню и открывает форму регистрации. */
  function openRegistration() {
    closeMenu();
    onOpenRegister();
  }

  return (
    <>
      <button
        type="button"
        className={cn(styles.burgerButton, { [styles.open]: isOpen })}
        onClick={toggleMenu}
        aria-label="Открыть меню"
        aria-expanded={isOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {isOpen && (
        <nav className={cn(styles.menu, styles.menuOpen)}>
          <div className={styles.menuHeader}>
            <div className={styles.menuLogo}>
              <LogoIcon />
            </div>
          </div>

          <MobileCapabilities
            isOpen={showCapabilities}
            onToggle={toggleCapabilities}
          />

          {HEADER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className={styles.menuLink}
            >
              {link.label}
            </Link>
          ))}

          <div className={styles.menuActions}>
            <button
              type="button"
              className={styles.menuSignUp}
              onClick={openRegistration}
            >
              Зарегистрироваться
            </button>
            <button
              type="button"
              className={styles.menuLogin}
              onClick={openLogin}
            >
              Войти
            </button>
          </div>
        </nav>
      )}
    </>
  );
}
