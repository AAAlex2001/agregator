"use client";

import {
  ARTICLE_DIRECTION_OPTIONS,
  ArticleCard,
  ArticleCardSkeleton,
  type ArticleKind,
  type ArticleList as ArticleListData,
} from "@/source/entities/article";
import Button from "@/source/shared/ui/Button";
import { Select } from "@/source/shared/ui/Select";
import { useArticlesList } from "../model/useArticlesList";
import s from "./ArticlesList.module.scss";

const SKELETON_KEYS = [1, 2, 3, 4, 5, 6];

interface ArticlesListProps {
  kind: ArticleKind;
  initial: ArticleListData;
  initialOffset?: number;
  nextPageHref?: string;
}

/** Сетка статей с фильтрами по направлению и тегу. Без фильтров «показать ещё» — ссылка на следующую страницу. */
export function ArticlesList({ kind, initial, initialOffset = 0, nextPageHref }: ArticlesListProps) {
  const { state, changeTag, changeDirection, loadMore } = useArticlesList(kind, initial, initialOffset);
  const tags = [...new Set(initial.items.flatMap((item) => item.tags))];
  const isFiltered = Boolean(state.tag || state.direction);

  return (
    <>
      <div className={s.filters}>
        <Select
          options={ARTICLE_DIRECTION_OPTIONS}
          value={state.direction}
          onChange={changeDirection}
          ariaLabel="Направление"
          className={s.select}
        />
        {tags.length > 0 && (
          <Select
            options={[{ value: "", label: "Все теги" }, ...tags.map((tag) => ({ value: tag, label: tag }))]}
            value={state.tag}
            onChange={changeTag}
            ariaLabel="Тег"
            className={s.select}
          />
        )}
      </div>

      {state.isReloading && (
        <div className={s.grid}>
          {SKELETON_KEYS.map((key) => (
            <ArticleCardSkeleton key={key} />
          ))}
        </div>
      )}

      {!state.isReloading && state.items.length === 0 && (
        <div className={s.empty}>{kind === "news" ? "Новостей пока нет — заходите позже." : "Статей пока нет — заходите позже."}</div>
      )}

      {!state.isReloading && state.items.length > 0 && (
        <ul className={s.grid}>
          {state.items.map((item) => (
            <li key={item.id}>
              <ArticleCard article={item} />
            </li>
          ))}
          {state.isLoadingMore &&
            [1, 2, 3].map((key) => (
              <li key={`more-${key}`} aria-hidden="true">
                <ArticleCardSkeleton />
              </li>
            ))}
        </ul>
      )}

      {!state.isReloading && nextPageHref && !isFiltered && (
        <div className={s.loadMore}>
          <Button href={nextPageHref} scroll={false} variant="outline" className={s.loadMoreButton}>
            Показать ещё
          </Button>
        </div>
      )}

      {!state.isReloading && (isFiltered || !nextPageHref) && state.hasMore && (
        <div className={s.loadMore}>
          <Button type="button" variant="outline" className={s.loadMoreButton} onClick={loadMore} isLoading={state.isLoadingMore}>
            Показать ещё
          </Button>
        </div>
      )}
    </>
  );
}
