"use client";

import cn from "classnames";
import Link from "next/link";
import type { ReactNode } from "react";
import { PostAvatar } from "@/entities/post";
import type { PostStatus } from "@/entities/post";
import { useUser } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { MY_POST_TABS } from "../../config/my-post-tabs";
import styles from "./style.module.scss";

/** Открытая вкладка и публикации из неё. */
interface MyPostsProps {
  status: PostStatus;
  children: ReactNode;
}

/** Свои публикации по вкладкам-ссылкам: опубликованные, черновики и скрытые модератором. */
export function MyPosts({ status, children }: MyPostsProps) {
  const { user } = useUser();
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const name = fullName || "Мой профиль";
  const current = MY_POST_TABS.find((tab) => tab.status === status);

  return (
    <div className={styles.section}>
      <div className={styles.head}>
        <div className={styles.heading}>
          <Title
            as="h1"
            text="Мои публикации"
          />
          <Subtitle
            text="Пишите о своём опыте, редактируйте публикации и возвращайтесь к черновикам."
            className={styles.subtitle}
          />
        </div>
        <Button href="/posts/new">Написать пост</Button>
      </div>
      <div className={styles.profile}>
        <PostAvatar
          src={user?.avatar_url ?? null}
          name={name}
          className={styles.avatar}
        />
        <Title
          as="h2"
          text={name}
          className={styles.profileTitle}
        />
      </div>
      <nav
        className={styles.tabs}
        aria-label="Мои публикации"
      >
        {MY_POST_TABS.map((tab) => (
          <Link
            key={tab.status}
            href={`/posts/my?status=${tab.status}`}
            className={cn(styles.tab, {
              [styles.active]: tab.status === status,
            })}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <p className={styles.hint}>{current?.hint}</p>
      {children}
    </div>
  );
}
