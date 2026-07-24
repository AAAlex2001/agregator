"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Button from "@/source/shared/ui/Button";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  RtnCard,
  fetchRtnList,
  type RtnList,
  type RtnTaxonomy,
} from "@/source/entities/rtn-clarification";
import { AskRtnQuestionForm } from "@/source/features/rtn-feedback";
import { useRtnCatalogFilters } from "../model/useRtnCatalogFilters";
import { RtnFilters } from "./RtnFilters";
import s from "./RtnCatalog.module.scss";

const PAGE_SIZE = 12;

interface Props {
  initial: RtnList;
  taxonomy: RtnTaxonomy;
  homeHref?: string;
}

export function RtnCatalog({ initial, taxonomy, homeHref = "/" }: Props) {
  const { showError } = useNotifications();
  const {
    filters,
    searchInput,
    setSearchInput,
    submitSearch,
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
        className={s.searchRow}
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
      >
        <input
          type="text"
          className={s.searchInput}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Поиск по ключевым словам, номеру письма или названию оборудования"
        />
        <Button type="submit" variant="primary" className={s.searchButton}>
          Найти
        </Button>
      </form>

      <div className={s.layout}>
        <div className={s.results}>
          {items.length === 0 ? (
            <div className={s.empty}>По вашему запросу ничего не найдено. Попробуйте изменить фильтры.</div>
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
