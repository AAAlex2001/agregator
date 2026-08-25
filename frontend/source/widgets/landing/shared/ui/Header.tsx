"use client";

import Link from "next/link";
import Button from "@/source/shared/ui/Button";
import { LogoMarkIcon } from "@/source/shared/ui/icons";
import { ExpertHelpPlates } from "@/source/widgets/expert-help";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import BurgerMenu from "./BurgerMenu";
import HeaderMarquee from "./HeaderMarquee";
import s from "./header.module.scss";

const NAV_PAGES = [
  { href: "/orders", label: "Заявки" },
  { href: "/news", label: "Новости" },
  { href: "/blog", label: "Блог" },
  { href: "/reviews", label: "Отзывы" },
] as const;

const Header = () => {
  const { openAuth } = useAuthModal();
  return (
    <div className={s.shell}>
      <HeaderMarquee />
      <header className={s.header}>
        <div className={s.container}>
          <Link href="/" className={s.brand} aria-label="На главную">
            <span className={s.logo}>
              <LogoMarkIcon />
            </span>
          </Link>
          <nav className={s.nav}>
            {NAV_PAGES.map((page) => (
              <Link key={page.href} href={page.href}>
                {page.label}
              </Link>
            ))}
          </nav>
          <div className={s.actions}>
            <Button variant="outline" className={s.login} onClick={() => openAuth("login")}>
              Войти
            </Button>
            <Button variant="primary" className={s.signUp} onClick={() => openAuth("register")}>
              Зарегистрироваться
            </Button>
          </div>
          <div className={s.mobileActions}>
            <Button
              variant="outline"
              size="sm"
              className={s.mobileLogin}
              onClick={() => openAuth("login")}
            >
              Войти
            </Button>
            <BurgerMenu showGuestCapabilities />
          </div>
        </div>
        <nav className={s.guestNav} aria-label="Возможности после регистрации">
          <ExpertHelpPlates mode="guest" compact />
        </nav>
      </header>
    </div>
  );
};

export default Header;
