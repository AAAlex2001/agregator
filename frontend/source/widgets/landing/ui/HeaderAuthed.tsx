import Link from "next/link";
import { ExpertHelpPlates } from "@/source/widgets/expert-help";
import CabinetBurgerMenu from "./CabinetBurgerMenu";
import PromoDrawer, { PromoNavButtons } from "./PromoDrawer";
import s from "./header-authed.module.scss";

const NAV_PAGES = [
  { href: "/landing/news", label: "Новости" },
  { href: "/landing/blog", label: "Блог" },
] as const;

const HeaderAuthed = () => (
  <>
    <PromoDrawer />
    <header className={s.header}>
      <nav className={s.nav} aria-label="Основная навигация">
        <ExpertHelpPlates />
        <div className={s.menuLinks}>
          {NAV_PAGES.map((page) => (
            <Link key={page.href} href={page.href} className={s.navLink}>
              {page.label}
            </Link>
          ))}
        </div>
        <div className={s.promoRow}>
          <PromoNavButtons
            className={`${s.navLink} ${s.navLinkPromo}`}
            botClassName={s.navLinkPromoBot}
            appClassName={s.navLinkPromoApp}
            rtnClassName={s.navLinkPromoRtn}
          />
        </div>
        <CabinetBurgerMenu />
      </nav>
    </header>
  </>
);

export default HeaderAuthed;
