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
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import Tabs from "@/source/shared/ui/Tabs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useNotifications } from "@/source/shared/ui/Notifications";
import s from "./ArticlesList.module.scss";

const PAGE_SIZE = 12;
const SKELETON_COUNT = 6;

interface CrossPromotion {
  title: string;
  href: string;
  hrefLabel: string;
  items: ArticleListItem[];
}

interface Props {
  kind: ArticleKind;
  title: string;
  subtitle: string;
  initial: ArticleList;
  cross?: CrossPromotion;
  homeHref?: string;
}

function collectTags(items: ArticleListItem[]): string[] {
  const set = new Set<string>();
  items.forEach((item) => item.tags.forEach((tag) => set.add(tag)));
  return Array.from(set);
}

export function ArticlesList({ kind, title, subtitle, initial, cross, homeHref = "/" }: Props) {
  const { showError } = useNotifications();
  const [items, setItems] = useState<ArticleListItem[]>(initial.items);
  const [hasMore, setHasMore] = useState<boolean>(initial.has_more);
  const [activeTag, setActiveTag] = useState<string>("");
  const [isReloading, setIsReloading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const availableTags = collectTags(initial.items);

  const tabItems = [
    { id: "", label: "Все" },
    ...availableTags.map((tag) => ({ id: tag, label: tag })),
  ];

  async function reload(tag: string) {
    setIsReloading(true);
    try {
      const page = await fetchArticleList({ kind, limit: PAGE_SIZE, offset: 0, tag: tag || undefined });
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
        tag: activeTag || undefined,
      });
      setItems((prev) => [...prev, ...page.items]);
      setHasMore(page.has_more);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось подгрузить");
    } finally {
      setIsLoadingMore(false);
    }
  }

  function selectTab(tabId: string) {
    if (tabId === activeTag) return;
    setActiveTag(tabId);
    void reload(tabId);
  }

  return (
    <div className={s.wrapper}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: homeHref },
          { label: kind === "news" ? "Новости" : "Блог" },
        ]}
      />
      <div className={s.head}>
        <Title text={title} as="h1" className={s.title} />
        <Subtitle text={subtitle} className={s.subtitle} />
      </div>

      {availableTags.length > 0 && (
        <Tabs
          tabs={tabItems}
          activeTab={activeTag}
          onTabChange={selectTab}
          variant="pill"
        />
      )}

      {isReloading ? (
        <div className={s.grid}>
          {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
            <ArticleCardSkeleton key={idx} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className={s.empty}>
          {kind === "news" ? "Новостей пока нет — заходите позже." : "Статей пока нет — заходите позже."}
        </div>
      ) : (
        <div className={s.grid}>
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
        <div className={s.loadMoreWrap}>
          <button type="button" className={s.loadMore} onClick={loadMore} disabled={isLoadingMore}>
            {isLoadingMore ? "Загружаем..." : "Показать ещё"}
          </button>
        </div>
      )}

      {cross && cross.items.length > 0 && (
        <section className={s.cross}>
          <div className={s.crossHead}>
            <h2 className={s.crossTitle}>{cross.title}</h2>
            <a href={cross.href} className={s.crossLink}>{cross.hrefLabel} →</a>
          </div>
          <div className={s.grid}>
            {cross.items.map((item) => (
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
          </div>
        </section>
      )}
    </div>
  );
}
