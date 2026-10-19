"use client";

import cn from "classnames";
import Link from "next/link";
import type { ReactNode } from "react";
import type { PostStatus } from "@/entities/post";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { MY_POST_TABS } from "../../config/my-post-tabs";
import { NewPostMenu } from "../new-post-menu";
import styles from "./style.module.scss";

/** Открытая вкладка и посты из неё. */
interface MyPostsProps {
  status: PostStatus;
  children: ReactNode;
}

/** Свои посты на сайте и в Telegram по вкладкам: опубликованные, черновики и скрытые. */
export function MyPosts({ status, children }: MyPostsProps) {
  const current = MY_POST_TABS.find((tab) => tab.status === status);

  return (
    <div className={styles.section}>
      <div className={styles.head}>
        <div className={styles.heading}>
          <Title
            as="h1"
            text="Мои посты"
          />
          <Subtitle
            text="Посты в ленте сайта и в ваших Telegram-каналах — в одном месте."
            className={styles.subtitle}
          />
        </div>
        <NewPostMenu />
      </div>
      <nav
        className={styles.tabs}
        aria-label="Мои посты"
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
