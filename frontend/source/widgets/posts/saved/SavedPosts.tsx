"use client";

import { useSession } from "@/source/entities/session";
import { PostList } from "../list/PostList";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import s from "../posts.module.scss";

/** Публикации, которые пользователь отметил закладкой. */
export function SavedPosts() {
  const { user } = useSession();
  return (
    <div className={s.section}>
      <div className={s.heading}>
        <Title as="h1" text="Сохранённое" />
        <Subtitle
          text="Публикации, которые вы сохранили, чтобы вернуться к ним позже."
          className={s.subtitle}
        />
      </div>
      <PostList
        key={user?.id}
        query={{ mode: "saved" }}
        emptyTitle="Сохранённых публикаций нет"
        emptyText="Нажмите на закладку под постом, чтобы он появился здесь."
      />
    </div>
  );
}
