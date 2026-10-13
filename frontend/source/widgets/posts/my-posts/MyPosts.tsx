"use client";

import cn from "classnames";
import { useState } from "react";
import type { PostStatus } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import { PostAvatar } from "@/source/entities/posts";
import Button from "@/source/shared/ui/Button";
import { usePostCounts } from "@/source/features/posts/my-posts/load-counts/model/usePostCounts";
import { PostList } from "../list/PostList";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "../posts.module.scss";

const STATUS_HINTS: Record<PostStatus, string> = {
  published: "Ваши опубликованные записи. Управление — в меню публикации.",
  draft: "Черновики видите только вы. Опубликовать — через «Изменить» в меню.",
  hidden: "Эти публикации скрыты модератором.",
};

/** Мои публикации и черновики со счётчиками и действиями автора. */
export function MyPosts({ initialStatus = "published" }: { initialStatus?: PostStatus }) {
  const { user } = useSession();
  const [status, setStatus] = useState<PostStatus>(initialStatus);
  const { counts, reload } = usePostCounts(user?.id);
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Мой профиль";
  return (
    <div className={s.section}>
      <div className={s.head}>
        <div className={s.heading}>
          <Title as="h1" text="Мои публикации" />
          <Subtitle
            text="Пишите о своём опыте, редактируйте публикации и возвращайтесь к черновикам."
            className={s.subtitle}
          />
        </div>
        <Button href="/posts/new">Написать пост</Button>
      </div>
      <div className={s.profile}>
        <PostAvatar
          src={user?.avatar_url}
          name={name}
          className={s.avatar}
        />
        <div>
          <Title as="h2" text={name} className={s.profileTitle} />
          <Subtitle
            className={s.profileSubtitle}
            text={
              counts
                ? `${counts.published} публикаций · ${counts.draft} черновиков`
                : "Ваши публикации и черновики"
            }
          />
        </div>
      </div>
      <div
        className={s.tabs}
        role="tablist"
        aria-label="Мои публикации"
      >
        <button
          type="button"
          role="tab"
          aria-selected={status === "published"}
          className={cn(s.tab, status === "published" && s.active)}
          onClick={() => setStatus("published")}
        >
          Публикации
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={status === "draft"}
          className={cn(s.tab, status === "draft" && s.active)}
          onClick={() => setStatus("draft")}
        >
          Черновики
        </button>
        {Boolean(counts?.hidden) && (
          <button
            type="button"
            role="tab"
            aria-selected={status === "hidden"}
            className={cn(s.tab, status === "hidden" && s.active)}
            onClick={() => setStatus("hidden")}
          >
            Скрытые
          </button>
        )}
      </div>
      <p className={s.hint}>{STATUS_HINTS[status]}</p>
      <PostList
        key={`${status}-${user?.id}`}
        query={{ mode: "my", status }}
        emptyTitle="Здесь пока пусто"
        emptyText="Расскажите о своём опыте и услугах: текст, фото и видео."
        onChanged={reload}
      />
    </div>
  );
}
