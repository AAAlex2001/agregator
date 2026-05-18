"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoIcon } from "@/source/shared/ui/icons";
import s from "./authedBurgerMenu.module.scss";

interface NavItem {
  href: string;
  label: string;
}

interface AuthedBurgerMenuProps {
  items: readonly NavItem[];
}

const AuthedBurgerMenu = ({ items }: AuthedBurgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        className={`${s.burgerButton} ${isOpen ? s.open : ""}`}
        onClick={toggle}
        aria-label="Открыть меню"
        aria-expanded={isOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && (
        <nav className={s.menu}>
          <div className={s.menuHeader}>
            <div className={s.menuLogo}>
              <LogoIcon />
            </div>
          </div>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className={s.menuLink}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
};

export default AuthedBurgerMenu;
