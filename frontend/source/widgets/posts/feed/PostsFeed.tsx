"use client";

import cn from "classnames";
import Link from "next/link";
import type { ReactNode } from "react";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import Button from "@/source/shared/ui/Button";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "../posts.module.scss";

interface PostsFeedProps {
  tab: "all" | "following";
  authorId?: number;
  unseenCount: number | null;
  children: ReactNode;
}

/** Лента: заголовок, «Написать пост» и вкладки-ссылки «Для вас» и «Подписки».
 *  Вкладки видит только вошедший (unseenCount не null); публикации приходят в children. */
export function PostsFeed({ tab, authorId, unseenCount, children }: PostsFeedProps) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();

  const title = authorId ? "Публикации автора" : "Лента";
  const subtitle = authorId
    ? "Опыт, новости и материалы, которыми делится автор."
    : "Опыт, новости и полезные материалы от участников сообщества.";
  const showTabs = unseenCount !== null && !authorId;

  return (
    <div className={s.section}>
      <div className={s.head}>
        <div className={s.heading}>
          <Title as="h1" text={title} />
          <Subtitle text={subtitle} className={s.subtitle} />
        </div>
        {user ? (
          <Button href="/posts/new">Написать пост</Button>
        ) : (
          <Button onClick={() => openAuth("login")}>Написать пост</Button>
        )}
      </div>
      {showTabs && (
        <nav className={s.tabs} aria-label="Разделы ленты">
          <Link
            href="/posts"
            className={cn(s.tab, { [s.active]: tab === "all" })}
          >
            Для вас
          </Link>
          <Link
            href="/posts/following"
            className={cn(s.tab, { [s.active]: tab === "following" })}
          >
            Подписки
            {unseenCount > 0 && <span className={s.badge}>{unseenCount}</span>}
          </Link>
        </nav>
      )}
      {children}
    </div>
  );
}
