"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BookmarkIcon, RepostIcon, SquarePenIcon } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { NewspaperIcon } from "@/source/shared/ui/icons/NewspaperIcon";
import s from "./PostsLayout.module.scss";

const SECTIONS = [
  { href: "/posts", label: "Лента", Icon: NewspaperIcon },
  { href: "/posts/my", label: "Мои публикации", Icon: SquarePenIcon },
  { href: "/posts/saved", label: "Сохранённое", Icon: BookmarkIcon },
  { href: "/posts/reposts", label: "Репосты", Icon: RepostIcon },
];

/** Какой раздел подсветить в меню и как назвать страницу в хлебных крошках. */
function currentPage(pathname: string) {
  if (pathname === "/posts/new") return { section: "/posts/my", title: "Новая публикация" };
  if (pathname.endsWith("/edit")) return { section: "/posts/my", title: "Редактирование" };
  if (pathname.endsWith("/repost")) return { section: "/posts/reposts", title: "Репост" };
  const section = SECTIONS.find((item) => item.href === pathname);
  return { section: section?.href ?? "/posts", title: section?.label ?? "Публикация" };
}

interface PostsLayoutProps {
  children: ReactNode;
}

/** Раздел публикаций: хлебные крошки и меню разделов — справа на ПК и над лентой на телефоне. */
export function PostsLayout({ children }: PostsLayoutProps) {
  const pathname = usePathname();
  const { role } = useSession();
  const page = currentPage(pathname);
  const home = role ? { label: "Профиль", href: "/settings" } : { label: "Главная", href: "/" };
  const posts = { label: "Публикации", href: "/posts" };

  return (
    <div className={s.page}>
      <Breadcrumbs items={pathname === "/posts" ? [home, posts] : [home, posts, { label: page.title }]} />
      <div className={s.layout}>
        <nav className={s.nav} aria-label="Разделы публикаций">
          {SECTIONS.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(s.item, { [s.active]: href === page.section })}
              aria-current={href === page.section ? "page" : undefined}
            >
              <Icon className={s.icon} />
              {label}
            </Link>
          ))}
        </nav>
        <div key={pathname} className={s.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
