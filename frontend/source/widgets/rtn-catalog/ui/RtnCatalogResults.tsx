"use client";

import { useEffect, useState } from "react";
import Button from "@/source/shared/ui/Button";
import { EmptyStateCard } from "@/source/shared/ui";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
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
}

export function RtnCatalogResults({ initial, taxonomy }: Props) {
  const { showError } = useNotifications();
  const {
    filters,
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
    <>
      <div className={s.results}>
        {items.length === 0 ? (
          hasActiveFilters ? (
            <EmptyStateCard
              title="Ничего не найдено"
              subtitle="Попробуйте изменить запрос или сбросить фильтры"
              actionLabel="Сбросить фильтры"
              onAction={resetFilters}
            />
          ) : (
            <EmptyStateCard
              title="Пока нет опубликованных разъяснений"
              subtitle="Ростехнадзор ещё не опубликовал материалы в этом разделе — загляните позже"
            />
          )
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

      <AskRtnQuestionForm open={askOpen} onClose={() => setAskOpen(false)} />
    </>
  );
}
