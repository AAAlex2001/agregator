"use client";

import { EmptyStateCard } from "@/source/shared/ui";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { RtnCard, type RtnList, type RtnTaxonomy } from "@/source/entities/rtn-clarification";
import { useRtnCatalogFilters, useRtnCatalogResults, RtnFilters } from "@/source/features/rtn-catalog";
import s from "./RtnCatalogWidget.module.scss";

interface Props {
  initial: RtnList;
  taxonomy: RtnTaxonomy;
}

export function RtnCatalogResults({ initial, taxonomy }: Props) {
  const {
    filters,
    toggleTaxonomy,
    toggleDocumentType,
    toggleStatus,
    setDateRange,
    resetFilters,
    hasActiveFilters,
  } = useRtnCatalogFilters();
  const { items, hasMore, isLoadingMore, loadMore } = useRtnCatalogResults(initial, filters);

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
              subtitle="Ответы Ростехнадзора еще не опубликованы в этом разделе — загляните позже"
            />
          )
        ) : (
          <ul className={s.grid}>
            {items.map((item) => (
              <RtnCard key={item.id} item={item} horizontal />
            ))}
          </ul>
        )}

        {hasMore && (
          <div ref={sentinelRef} className={s.sentinel}>
            {isLoadingMore && <span className={s.loadingLabel}>Загружаем…</span>}
          </div>
        )}
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
    </>
  );
}
