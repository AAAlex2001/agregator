"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronIcon, LogoIcon, TechExpertLogoIcon } from "@/source/shared/ui/icons";
import { getGuestCabinetNav } from "@/source/widgets/expert-help";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import s from "./burgerMenu.module.scss";

const NAV_PAGES = [
  { href: "/orders", label: "Заявки" },
  { href: "/news", label: "Новости" },
  { href: "/blog", label: "Блог" },
  { href: "/reviews", label: "Отзывы" },
] as const;

const BurgerMenu = ({ showGuestCapabilities = false }: { showGuestCapabilities?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCapabilities, setShowCapabilities] = useState(false);
  const capabilities = getGuestCabinetNav();
  const { openAuth } = useAuthModal();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => {
    setIsOpen(false);
    setShowCapabilities(false);
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
        <nav className={`${s.menu} ${isOpen ? s.menuOpen : ""}`}>
          <div className={s.menuHeader}>
            <div className={s.menuLogo}>
              <LogoIcon />
            </div>
          </div>
          {showGuestCapabilities && (
            <div className={s.capabilities}>
              <button
                type="button"
                className={s.capabilitiesToggle}
                onClick={() => setShowCapabilities((value) => !value)}
                aria-expanded={showCapabilities}
              >
                  <span>
                    <span className={s.capabilitiesTitle}>Возможности платформы</span>
                    <span className={s.capabilitiesHint}>Сервисы и полезные материалы</span>
                  </span>
                <ChevronIcon
                  className={`${s.capabilitiesChevron} ${showCapabilities ? s.capabilitiesChevronOpen : ""}`}
                  color="currentColor"
                />
              </button>
              {showCapabilities && (
                <div className={s.capabilitiesList}>
                  {capabilities.map((plate) => (
                    <div
                      key={plate.key}
                      className={`${s.capabilityPlate} ${s[plate.color]}`}
                      aria-label={`${plate.label}. Доступно после регистрации`}
                    >
                      <span className={s.capabilityLabel}>
                        {plate.logo ? <TechExpertLogoIcon title={plate.label} /> : plate.label}
                      </span>
                      <span className={s.lockedBadge}>после регистрации</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
            <button
              type="button"
              className={s.menuSignUp}
              onClick={() => {
                closeMenu();
                openAuth("register");
              }}
            >
              Зарегистрироваться
            </button>
            <button
              type="button"
              className={s.menuLogin}
              onClick={() => {
                closeMenu();
                openAuth("login");
              }}
            >
              Войти
            </button>
          </div>
        </nav>
      )}
    </>
  );
};

export default BurgerMenu;
