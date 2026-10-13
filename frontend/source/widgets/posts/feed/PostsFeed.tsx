"use client";

import { useState, type ReactNode } from "react";
import cn from "classnames";
import { useSession } from "@/source/entities/session";
import { useAuthModal } from "@/source/shared/lib/auth-modal";
import { useFollowingUnseen } from "@/source/features/posts/feed/mark-as-read/model/useFollowingUnseen";
import Button from "@/source/shared/ui/Button";
import { PostList } from "../list/PostList";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "../posts.module.scss";

interface Props {
  authorId?: number;
  children: ReactNode;
}

/** Лента для всех читателей и отдельная вкладка подписок. */
export function PostsFeed({ authorId, children }: Props) {
  const { user } = useSession();
  const { openAuth } = useAuthModal();
  const [tab, setTab] = useState<"all" | "following">("all");
  const unseen = useFollowingUnseen(user?.id);
  const showFollowing = Boolean(user && !authorId && tab === "following");
  const title = authorId ? "Публикации автора" : "Лента";
  let description = "Опыт, новости и полезные материалы от участников сообщества.";
  if (showFollowing) description = "Новые публикации авторов, на которых вы подписаны.";
  if (authorId) description = "Опыт, новости и материалы, которыми делится автор.";
  return (
    <div className={s.section}>
      <div className={s.head}>
        <div className={s.heading}>
          <Title as="h1" text={title} />
          <Subtitle text={description} className={s.subtitle} />
        </div>
        {user ? (
          <Button href="/posts/new">Написать пост</Button>
        ) : (
          <Button onClick={() => openAuth("login")}>Написать пост</Button>
        )}
      </div>
      {user && !authorId && (
        <div
          className={s.tabs}
          role="tablist"
          aria-label="Разделы ленты"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "all"}
            className={cn(s.tab, tab === "all" && s.active)}
            onClick={() => setTab("all")}
          >
            Для вас
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "following"}
            className={cn(s.tab, tab === "following" && s.active)}
            onClick={() => {
              setTab("following");
              void unseen.seen();
            }}
          >
            Подписки {unseen.count > 0 && <span className={s.badge}>{unseen.count}</span>}
          </button>
        </div>
      )}
      {showFollowing ? (
        <PostList
          key={`following-${user?.id}`}
          query={{ mode: "following" }}
          emptyTitle="В подписках пока пусто"
          emptyText="Подпишитесь на интересных авторов через меню публикации."
        />
      ) : (
        children
      )}
    </div>
  );
}
