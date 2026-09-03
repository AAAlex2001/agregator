"use client";

import Button from "@/source/shared/ui/Button";
import { EmptyStateCard } from "@/source/shared/ui";
import { RtnCard, type RtnList, type RtnTaxonomy } from "@/source/entities/rtn-clarification";
import { useRtnCatalogFilters, useRtnCatalogResults, RtnFilters } from "@/source/features/rtn-catalog";
import s from "./RtnCatalogWidget.module.scss";

interface Props {
  initial: RtnList;
  taxonomy: RtnTaxonomy;
  nextPageHref?: string;
}

export function RtnCatalogResults({ initial, taxonomy, nextPageHref }: Props) {
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

        {nextPageHref && !hasActiveFilters ? (
          <div className={s.loadMoreWrap}>
            <Button href={nextPageHref} scroll={false} variant="outline" className={s.loadMore}>
              Показать ещё
            </Button>
          </div>
        ) : hasMore ? (
          <div className={s.loadMoreWrap}>
            <Button
              type="button"
              variant="outline"
              className={s.loadMore}
              onClick={loadMore}
              isLoading={isLoadingMore}
            >
              Показать ещё
            </Button>
          </div>
        ) : null}
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
