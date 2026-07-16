import Link from "next/link";
import { LogoIcon } from "@/source/shared/ui/icons";
import { ExpertHelpPlates } from "@/source/widgets/expert-help";
import BurgerMenu from "./BurgerMenu";
import PublicHeaderShell from "./PublicHeaderShell";
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
      <PublicHeaderShell className={s.header} hiddenClassName={s.headerHidden}>
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
            <Link href="/login" className={s.login}> Войти
            </Link>
            <Link href="/register" className={s.signUp}>  Зарегистрироваться
            </Link>
          </div>
          <div className={s.mobileActions}>
            <Link href="/login" className={s.mobileLogin}>Войти</Link>
            <BurgerMenu showGuestCapabilities />
          </div>
        </div>
        <nav className={s.guestNav} aria-label="Возможности после регистрации">
          <ExpertHelpPlates mode="guest" />
        </nav>
      </PublicHeaderShell>
    </>
  );
};

export default Header;
