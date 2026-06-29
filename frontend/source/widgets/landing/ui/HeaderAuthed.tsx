import Link from "next/link";
import { ExpertHelpMenu, ExpertHelpPlates } from "@/source/widgets/expert-help";
import { ReviewsMenu } from "@/source/widgets/reviews-hub";
import s from "./header-authed.module.scss";

const NAV_PAGES = [
  { href: "/landing/news", label: "Новости" },
  { href: "/landing/blog", label: "Блог" },
] as const;

const HeaderAuthed = () => (
  <header className={s.header}>
    <nav className={s.nav} aria-label="Основная навигация">
      <ExpertHelpPlates />
      <div className={s.mobileMenus}>
        <ExpertHelpMenu />
        <ReviewsMenu />
      </div>
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
