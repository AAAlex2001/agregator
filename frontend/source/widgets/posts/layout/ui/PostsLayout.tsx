"use client";

import cn from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { NewspaperIcon, SquarePenIcon, BookmarkIcon, RepostIcon } from "@/source/entities/posts/ui/icons";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { useSession } from "@/source/entities/session";
import s from "./PostsLayout.module.scss";

const sections = [
  { href: "/posts", label: "Лента", Icon: NewspaperIcon },
  { href: "/posts/my", label: "Мои публикации", Icon: SquarePenIcon },
  { href: "/posts/saved", label: "Сохранённое", Icon: BookmarkIcon },
  { href: "/posts/reposts", label: "Репосты", Icon: RepostIcon },
];

/** Меню публикаций справа на ПК и над лентой на телефоне. */
export function PostsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const { user, role } = useSession();
  const signedIn = Boolean(user || role);
  const section = sections.find((item) => item.href === pathname);
  let current = section?.href ?? "/posts";
  let pageTitle = section?.label ?? "Публикация";

  if (pathname === "/posts/new") {
    current = "/posts/my";
    pageTitle = "Новая публикация";
  }

  if (pathname.endsWith("/edit")) {
    current = "/posts/my";
    pageTitle = "Редактирование";
  }

  if (pathname.endsWith("/repost")) {
    current = "/posts/reposts";
    pageTitle = "Репост";
  }

  // Прокручивает только панель вкладок, чтобы выбранный раздел был виден.
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (nav && active) {
      nav.scrollLeft = active.offsetLeft;
    }
  }, [current]);

  const breadcrumbs = [
    { label: signedIn ? "Профиль" : "Главная", href: signedIn ? "/settings" : "/" },
    { label: "Публикации", href: "/posts" },
    ...(pathname === "/posts" ? [] : [{ label: pageTitle }]),
  ];

  return (
    <div className={s.page}>
      <Breadcrumbs items={breadcrumbs} />
      <div className={s.layout}>
        <nav
          ref={navRef}
          className={s.nav}
          aria-label="Разделы публикаций"
        >
          {sections.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(s.item, { [s.active]: href === current })}
              aria-current={href === current ? "page" : undefined}
            >
              <Icon className={s.icon} />
              {label}
            </Link>
          ))}
        </nav>
        <div
          key={pathname}
          className={s.content}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
