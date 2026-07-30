import Link from "next/link";
import Button from "@/source/shared/ui/Button";
import { LogoIcon } from "@/source/shared/ui/icons";
import { ExpertHelpPlates } from "@/source/widgets/expert-help";
import BurgerMenu from "./BurgerMenu";
import s from "./header.module.scss";

const NAV_PAGES = [
  { href: "/orders", label: "Заявки" },
  { href: "/news", label: "Новости" },
  { href: "/blog", label: "Блог" },
  { href: "/reviews", label: "Отзывы" },
] as const;

const Header = () => {
  return (
    <>
      <header className={s.header}>
        <div className={s.container}>
          <Link href="/" className={s.brand} aria-label="На главную">
            <span className={s.logo}>
              <LogoIcon />
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
            <Button href="/login" variant="outline" className={s.login}>
              Войти
            </Button>
            <Button href="/register" variant="primary" className={s.signUp}>
              Зарегистрироваться
            </Button>
          </div>
          <div className={s.mobileActions}>
            <Button href="/login" variant="outline" size="sm" className={s.mobileLogin}>
              Войти
            </Button>
            <BurgerMenu showGuestCapabilities />
          </div>
        </div>
        <nav className={s.guestNav} aria-label="Возможности после регистрации">
          <ExpertHelpPlates mode="guest" compact />
        </nav>
      </header>
    </>
  );
};

export default Header;
