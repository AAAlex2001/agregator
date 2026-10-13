"use client";

import cn from "classnames";
import { useState, type ReactNode } from "react";
import { useSession } from "@/source/entities/session";
import { useFollowingUnseen } from "@/source/features/posts/following-unseen";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import Button from "@/source/shared/ui/Button";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { PostList } from "../list/PostList";
import s from "../posts.module.scss";

type FeedTab = "all" | "following";

interface PostsFeedProps {
  authorId?: number;
  children: ReactNode;
}

/** Лента: заголовок, «Написать пост» и вкладки «Для вас» и «Подписки». «Для вас» приходит с сервера в children. */
export function PostsFeed({ authorId, children }: PostsFeedProps) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const unseen = useFollowingUnseen(user?.id);
  const [tab, setTab] = useState<FeedTab>("all");
  const showTabs = Boolean(user) && !authorId;

  const openFollowing = () => {
    setTab("following");
    void unseen.markSeen();
  };

  return (
    <div className={s.section}>
      <div className={s.head}>
        <div className={s.heading}>
          <Title as="h1" text={authorId ? "Публикации автора" : "Лента"} />
          <Subtitle
            text={
              authorId
                ? "Опыт, новости и материалы, которыми делится автор."
                : "Опыт, новости и полезные материалы от участников сообщества."
            }
            className={s.subtitle}
          />
        </div>
        {user ? <Button href="/posts/new">Написать пост</Button> : <Button onClick={() => openAuth("login")}>Написать пост</Button>}
      </div>
      {showTabs && (
        <div className={s.tabs} role="tablist" aria-label="Разделы ленты">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "all"}
            className={cn(s.tab, { [s.active]: tab === "all" })}
            onClick={() => setTab("all")}
          >
            Для вас
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "following"}
            className={cn(s.tab, { [s.active]: tab === "following" })}
            onClick={openFollowing}
          >
            Подписки {unseen.count > 0 && <span className={s.badge}>{unseen.count}</span>}
          </button>
        </div>
      )}
      {showTabs && tab === "following" ? (
        <PostList
          query={{ mode: "following" }}
          emptyTitle="В подписках пока пусто"
          emptyText="Подпишитесь на интересных авторов через меню публикации."
          emptyAction={{ label: "Перейти в ленту", href: "/posts" }}
        />
      ) : (
        children
      )}
    </div>
  );
}
