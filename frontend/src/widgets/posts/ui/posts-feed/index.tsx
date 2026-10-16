import cn from "classnames";
import Link from "next/link";
import type { ReactNode } from "react";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { WritePostButton } from "../write-post-button";
import styles from "./style.module.scss";

/** Заголовок, вкладка, счётчик новых публикаций в подписках и сами публикации. */
interface PostsFeedProps {
  title: string;
  tab: "all" | "following";
  authorId?: number;
  unseenCount: number | null;
  children: ReactNode;
}

/** Показывает ленту с вкладками «Для вас» и «Подписки»; вкладки видит только вошедший. */
export function PostsFeed({
  title,
  tab,
  authorId,
  unseenCount,
  children,
}: PostsFeedProps) {
  const subtitle = authorId
    ? "Опыт, новости и материалы, которыми делится автор."
    : "Опыт, новости и полезные материалы от участников сообщества.";
  const showTabs = unseenCount !== null && !authorId;

  return (
    <div className={styles.section}>
      <div className={styles.head}>
        <div className={styles.heading}>
          <Title
            as="h1"
            text={title}
          />
          <Subtitle
            text={subtitle}
            className={styles.subtitle}
          />
        </div>
        <WritePostButton />
      </div>
      {showTabs && (
        <nav
          className={styles.tabs}
          aria-label="Разделы ленты"
        >
          <Link
            href="/posts"
            className={cn(styles.tab, {
              [styles.active]: tab === "all",
            })}
          >
            Для вас
          </Link>
          <Link
            href="/posts/following"
            className={cn(styles.tab, {
              [styles.active]: tab === "following",
            })}
          >
            Подписки
            {unseenCount > 0 && (
              <span className={styles.badge}>{unseenCount}</span>
            )}
          </Link>
        </nav>
      )}
      {children}
    </div>
  );
}
