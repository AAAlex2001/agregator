"use client";

import { useState } from "react";
import {
  ArticleCard,
  ArticleCardSkeleton,
  fetchArticleList,
  type ArticleKind,
  type ArticleList,
  type ArticleListItem,
} from "@/source/entities/article";
import { useNotifications } from "@/source/shared/ui/Notifications";
import styles from "./ArticlesList.module.scss";

const PAGE_SIZE = 12;
const SKELETON_COUNT = 6;

interface Props {
  kind: ArticleKind;
  title: string;
  subtitle: string;
  initial: ArticleList;
}

function collectTags(items: ArticleListItem[]): string[] {
  const set = new Set<string>();
  items.forEach((item) => item.tags.forEach((tag) => set.add(tag)));
  return Array.from(set);
}

export function ArticlesList({ kind, title, subtitle, initial }: Props) {
  const { showError } = useNotifications();
  const [items, setItems] = useState<ArticleListItem[]>(initial.items);
  const [hasMore, setHasMore] = useState<boolean>(initial.has_more);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isReloading, setIsReloading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const availableTags = collectTags(initial.items);

  async function reload(tag: string | null) {
    setIsReloading(true);
    try {
      const page = await fetchArticleList({ kind, limit: PAGE_SIZE, offset: 0, tag: tag ?? undefined });
      setItems(page.items);
      setHasMore(page.has_more);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось обновить список");
    } finally {
      setIsReloading(false);
    }
  }

  async function loadMore() {
    if (!hasMore || isLoadingMore || isReloading) return;
    setIsLoadingMore(true);
    try {
      const page = await fetchArticleList({
        kind,
        limit: PAGE_SIZE,
        offset: items.length,
        tag: activeTag ?? undefined,
      });
      setItems((prev) => [...prev, ...page.items]);
      setHasMore(page.has_more);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось подгрузить");
    } finally {
      setIsLoadingMore(false);
    }
  }

  function selectTag(tag: string | null) {
    if (tag === activeTag) return;
    setActiveTag(tag);
    void reload(tag);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.head}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {availableTags.length > 0 && (
        <div className={styles.tags}>
          <button
            type="button"
            className={`${styles.tag} ${activeTag === null ? styles.tagActive : ""}`}
            onClick={() => selectTag(null)}
            disabled={isReloading}
          >
            Все
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`${styles.tag} ${activeTag === tag ? styles.tagActive : ""}`}
              onClick={() => selectTag(tag)}
              disabled={isReloading}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {isReloading ? (
        <div className={styles.grid}>
          {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
            <ArticleCardSkeleton key={idx} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          {kind === "news" ? "Новостей пока нет — заходите позже." : "Статей пока нет — заходите позже."}
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <ArticleCard
              key={item.id}
              kind={item.kind}
              slug={item.slug}
              title={item.title}
              excerpt={item.excerpt}
              cover_image={item.cover_image}
              tags={item.tags}
              published_at={item.published_at}
            />
          ))}
          {isLoadingMore && Array.from({ length: 3 }).map((_, idx) => (
            <ArticleCardSkeleton key={`more-${idx}`} />
          ))}
        </div>
      )}

      {hasMore && !isReloading && (
        <div className={styles.loadMoreWrap}>
          <button type="button" className={styles.loadMore} onClick={loadMore} disabled={isLoadingMore}>
            {isLoadingMore ? "Загружаем..." : "Показать ещё"}
          </button>
        </div>
      )}
    </div>
  );
}
