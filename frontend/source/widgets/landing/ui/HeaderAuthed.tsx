import Link from "next/link";
import { ExpertHelpPlates } from "@/source/widgets/expert-help";
import CabinetBurgerMenu from "./CabinetBurgerMenu";
import PromoBanner from "./PromoBanner";
import s from "./header-authed.module.scss";

const NAV_PAGES = [
  { href: "/landing/news", label: "Новости" },
  { href: "/landing/blog", label: "Блог" },
] as const;

const HeaderAuthed = () => (
  <>
    <PromoBanner />
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
        <CabinetBurgerMenu />
      </nav>
    </header>
  </>
);

export default HeaderAuthed;
