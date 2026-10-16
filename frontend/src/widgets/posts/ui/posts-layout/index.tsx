"use client";

import cn from "classnames";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useUser } from "@/entities/user";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { POSTS_SECTIONS } from "../../config/sections";
import { PostsLoginContext } from "../../model/login-context";
import styles from "./style.module.scss";

/** Раздел меню и заголовок в хлебных крошках для текущей страницы. */
function currentPage(pathname: string, postId?: string) {
  if (pathname === "/posts/new") {
    return {
      section: "/posts/my",
      title: "Новая публикация",
    };
  }

  if (pathname === "/posts/following") {
    return {
      section: "/posts",
      title: "Подписки",
    };
  }

  if (pathname === `/posts/${postId}/edit`) {
    return {
      section: "/posts/my",
      title: "Редактирование",
    };
  }

  if (pathname === `/posts/${postId}/repost`) {
    return {
      section: "/posts/reposts",
      title: "Репост",
    };
  }

  if (postId) {
    return {
      section: "/posts",
      title: `Публикация #${postId}`,
    };
  }

  const section = POSTS_SECTIONS.find((item) => item.href === pathname);

  return {
    section: pathname,
    title: section?.label ?? "Публикации",
  };
}

/** Страница раздела публикаций и открытие окна входа для действий гостя. */
interface PostsLayoutProps {
  children: ReactNode;
  onLogin: () => void;
}

/**
 * Показывает хлебные крошки и меню разделов: справа на ПК и над лентой на телефоне.
 * Содержимое пересоздаётся на каждом адресе, чтобы черновик не переносился на другой пост.
 * Действия гостя внутри раздела открывают вход через onLogin.
 */
export function PostsLayout({ children, onLogin }: PostsLayoutProps) {
  const pathname = usePathname();
  const { id } = useParams<{ id?: string }>();
  const { role } = useUser();
  const page = currentPage(pathname, id);

  const home = role
    ? {
        label: "Профиль",
        href: "/settings",
      }
    : {
        label: "Главная",
        href: "/",
      };
  const posts = {
    label: "Публикации",
    href: "/posts",
  };
  const breadcrumbs = pathname === "/posts"
    ? [home, posts]
    : [home, posts, { label: page.title }];

  return (
    <div className={styles.page}>
      <Breadcrumbs items={breadcrumbs} />
      <div className={styles.layout}>
        <nav
          className={styles.nav}
          aria-label="Разделы публикаций"
        >
          {POSTS_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = section.href === page.section;

            return (
              <Link
                key={section.href}
                href={section.href}
                className={cn(styles.item, {
                  [styles.active]: isActive,
                })}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className={styles.icon} />
                {section.label}
              </Link>
            );
          })}
        </nav>
        <div
          key={pathname}
          className={styles.content}
        >
          <PostsLoginContext.Provider value={onLogin}>
            {children}
          </PostsLoginContext.Provider>
        </div>
      </div>
    </div>
  );
}
