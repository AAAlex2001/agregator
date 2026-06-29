import Link from "next/link";
import { ExpertHelpMenu, ExpertHelpTabs } from "@/source/widgets/expert-help";
import s from "./header-authed.module.scss";

const NAV_PAGES = [
  { href: "/landing/news", label: "Новости" },
  { href: "/landing/blog", label: "Блог" },
  { href: "/landing/reviews", label: "Отзывы" },
] as const;

const HeaderAuthed = () => (
  <header className={s.header}>
    <nav className={s.nav} aria-label="Основная навигация">
      <ExpertHelpTabs />
      <ExpertHelpMenu />
      <div className={s.menuLinks}>
        {NAV_PAGES.map((page) => (
          <Link key={page.href} href={page.href} className={s.navLink}>
            {page.label}
          </Link>
        ))}
      </div>
    </nav>
  </header>
);

export default HeaderAuthed;
