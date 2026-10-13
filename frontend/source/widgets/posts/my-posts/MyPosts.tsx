"use client";

import cn from "classnames";
import Link from "next/link";
import { PostAvatar, type Post, type PostStatus } from "@/source/entities/posts";
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
  status: PostStatus;
  posts: Post[];
  nextPageHref?: string;
}

/** Свои публикации по вкладкам-ссылкам: опубликованные, черновики и скрытые модератором. */
export function MyPosts({ status, posts, nextPageHref }: MyPostsProps) {
  const { user } = useSession();
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
      <nav className={s.tabs} aria-label="Мои публикации">
        {TABS.map((tab) => (
          <Link
            key={tab.status}
            href={`/posts/my?status=${tab.status}`}
            className={cn(s.tab, { [s.active]: tab.status === status })}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <p className={s.hint}>{current?.hint}</p>
      <PostList
        posts={posts}
        nextPageHref={nextPageHref}
        emptyTitle="Здесь пока пусто"
        emptyText="Расскажите о своём опыте и услугах: текст, фото и видео."
        emptyActionLabel="Написать пост"
        emptyActionHref="/posts/new"
      />
    </div>
  );
}
