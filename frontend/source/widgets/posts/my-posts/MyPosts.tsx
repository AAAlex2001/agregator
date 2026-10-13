"use client";

import cn from "classnames";
import { useState } from "react";
import { PostAvatar, type PostStatus } from "@/source/entities/posts";
import { useSession } from "@/source/entities/session";
import Button from "@/source/shared/ui/Button";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { PostList } from "../list/PostList";
import s from "../posts.module.scss";

const TABS: { status: PostStatus; label: string; hint: string }[] = [
  {
    status: "published",
    label: "Публикации",
    hint: "Ваши опубликованные записи. Управление — в меню публикации.",
  },
  {
    status: "draft",
    label: "Черновики",
    hint: "Черновики видите только вы. Опубликовать — через «Изменить» в меню.",
  },
  {
    status: "hidden",
    label: "Скрытые",
    hint: "Публикации, скрытые модератором. Их видите только вы.",
  },
];

interface MyPostsProps {
  initialStatus: PostStatus;
}

/** Свои публикации по вкладкам: опубликованные, черновики и скрытые модератором. */
export function MyPosts({ initialStatus }: MyPostsProps) {
  const { user } = useSession();
  const [status, setStatus] = useState(initialStatus);
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const name = fullName || "Мой профиль";
  const current = TABS.find((tab) => tab.status === status);

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
        <PostAvatar src={user?.avatar_url ?? null} name={name} className={s.avatar} />
        <Title as="h2" text={name} className={s.profileTitle} />
      </div>
      <div className={s.tabs} role="tablist" aria-label="Мои публикации">
        {TABS.map((tab) => {
          const isActive = status === tab.status;

          return (
            <button
              key={tab.status}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={cn(s.tab, { [s.active]: isActive })}
              onClick={() => setStatus(tab.status)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <p className={s.hint}>{current?.hint}</p>
      <PostList
        key={status}
        query={{ mode: "my", status }}
        emptyTitle="Здесь пока пусто"
        emptyText="Расскажите о своём опыте и услугах: текст, фото и видео."
        emptyAction={{ label: "Написать пост", href: "/posts/new" }}
      />
    </div>
  );
}
