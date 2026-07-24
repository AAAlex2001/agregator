"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Button from "@/source/shared/ui/Button";
import { EmptyStateCard } from "@/source/shared/ui";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { SearchIcon } from "@/source/shared/ui/icons";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  RtnCard,
  fetchRtnList,
  type RtnList,
  type RtnTaxonomy,
} from "@/source/entities/rtn-clarification";
import { AskRtnQuestionForm } from "@/source/features/rtn-feedback";
import { useRtnCatalogFilters, RtnFilters } from "@/source/features/rtn-catalog";
import s from "./RtnCatalogWidget.module.scss";

const PAGE_SIZE = 12;

interface Props {
  initial: RtnList;
  taxonomy: RtnTaxonomy;
  homeHref?: string;
}

export function RtnCatalogWidget({ initial, taxonomy, homeHref = "/" }: Props) {
  const { showError } = useNotifications();
  const {
    filters,
    searchInput,
    setSearchInput,
    submitSearch,
    clearSearch,
    toggleTaxonomy,
    toggleDocumentType,
    toggleStatus,
    setDateRange,
    resetFilters,
    hasActiveFilters,
  } = useRtnCatalogFilters();

  const [items, setItems] = useState(initial.items);
  const [hasMore, setHasMore] = useState(initial.has_more);
  const [offset, setOffset] = useState(initial.items.length);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [askOpen, setAskOpen] = useState(false);

  useEffect(() => {
    setItems(initial.items);
    setHasMore(initial.has_more);
    setOffset(initial.items.length);
  }, [initial]);

  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const page = await fetchRtnList({ ...filters, limit: PAGE_SIZE, offset });
      setItems((prev) => [...prev, ...page.items]);
      setHasMore(page.has_more);
      setOffset((value) => value + page.items.length);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось подгрузить разъяснения");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const sentinelRef = useInfiniteScroll({ hasMore, isLoading: isLoadingMore, onLoadMore: loadMore });

  return (
    <div className={s.wrapper}>
      <Breadcrumbs items={[{ label: "Главная", href: homeHref }, { label: "Ростехнадзор отвечает" }]} />

      <div className={s.head}>
        <Title text="Ростехнадзор отвечает: база официальных ответов" as="h1" className={s.title} />
        <Subtitle
          text="Актуальные ответы на сложные вопросы промышленной, энергетической и строительной безопасности. Систематизированная база официальных ответов Ростехнадзора."
          className={s.subtitle}
        />
      </div>

      <form
        className={s.searchWrap}
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
      >
        <div className={s.searchBar}>
          <SearchIcon className={s.searchIcon} />
          <input
            type="text"
            className={s.searchInput}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Поиск по ключевым словам, номеру письма или названию оборудования"
          />
          {searchInput && (
            <button type="button" className={s.clearBtn} onClick={clearSearch} aria-label="Очистить">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <Button type="submit" variant="primary" size="md">
            Найти
          </Button>
        </div>
      </form>

      <div className={s.layout}>
        <div className={s.results}>
          {items.length === 0 ? (
            <EmptyStateCard
              title="Ничего не найдено"
              subtitle="Попробуйте изменить запрос или сбросить фильтры"
              actionLabel={hasActiveFilters ? "Сбросить фильтры" : undefined}
              onAction={hasActiveFilters ? resetFilters : undefined}
            />
          ) : (
            <ul className={s.grid}>
              {items.map((item) => (
                <RtnCard key={item.id} item={item} />
              ))}
            </ul>
          )}

          {hasMore && (
            <div ref={sentinelRef} className={s.sentinel}>
              {isLoadingMore && <span className={s.loadingLabel}>Загружаем…</span>}
            </div>
          )}

          <div className={s.askBlock}>
            <h2 className={s.askTitle}>Не нашли ответ?</h2>
            <p className={s.askDesc}>
              Отправьте вопрос — мы официально запросим разъяснение Ростехнадзора и опубликуем ответ в этом разделе.
            </p>
            <Button variant="primary" onClick={() => setAskOpen(true)}>
              Задать вопрос
            </Button>
          </div>
        </div>

        <RtnFilters
          taxonomy={taxonomy}
          filters={filters}
          onToggleDocumentType={toggleDocumentType}
          onToggleStatus={toggleStatus}
          onToggleTaxonomy={toggleTaxonomy}
          onDateRangeChange={setDateRange}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <AskRtnQuestionForm open={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  );
}
