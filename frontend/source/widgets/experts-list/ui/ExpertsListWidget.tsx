"use client";

import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Loader from "@/source/shared/ui/Loader";
import Skeleton from "@/source/shared/ui/Skeleton";
import { SortPills, type SortPillSpec } from "@/source/shared/ui/SortPills";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { ExpertCard, useExpertsList } from "@/source/entities/expert";
import type { ExpertSortBy } from "@/source/entities/expert";
import s from "./ExpertsListWidget.module.scss";

const SKELETON_COUNT = 3;

const SORT_OPTIONS: SortPillSpec<ExpertSortBy>[] = [
  {
    key: "rating",
    label: "Рейтинг",
    descLabel: "Сначала с высоким рейтингом",
    ascLabel: "Сначала с низким рейтингом",
  },
  {
    key: "completed_orders",
    label: "Количество заказов",
    descLabel: "Сначала больше заказов",
    ascLabel: "Сначала меньше заказов",
  },
  {
    key: "review_count",
    label: "Количество отзывов",
    descLabel: "Сначала больше отзывов",
    ascLabel: "Сначала меньше отзывов",
  },
];

export function ExpertsListWidget() {
  const {
    items, hasMore, isLoading, isLoadingMore, error,
    sortBy, sortDir, setSort, reload, loadMore,
  } = useExpertsList();
  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoading || isLoadingMore,
    onLoadMore: () => void loadMore(),
  });
  const isEmpty = !isLoading && !error && items.length === 0;

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Отзывы экспертов" as="h1" className={s.pageTitle} />
        <Subtitle
          text="Карточки аттестованных экспертов платформы. Посмотрите отзывы заказчиков и историю выполненных заказов."
          className={s.pageSubtitle}
        />
      </div>

      <div className={s.sortRow}>
        <SortPills
          options={SORT_OPTIONS}
          sortBy={sortBy}
          sortDir={sortDir}
          isLoading={isLoading}
          onChange={setSort}
        />
      </div>

      {isLoading ? (
        <div className={s.list}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <Skeleton key={index} className={s.cardSkeleton} rounded="lg" />
          ))}
        </div>
      ) : error ? (
        <div className={s.statusState}>
          <EmptyStateCard
            title="Не удалось загрузить экспертов"
            subtitle={error}
            actionLabel="Повторить"
            onAction={() => void reload()}
          />
        </div>
      ) : isEmpty ? (
        <div className={s.statusState}>
          <EmptyStateCard
            title="Пока нет экспертов с отзывами"
            subtitle="Здесь появятся аттестованные эксперты, получившие отзывы от заказчиков"
          />
        </div>
      ) : (
        <>
          <div className={s.list}>
            {items.map((expert) => (
              <ExpertCard
                key={expert.publicId}
                publicId={expert.publicId}
                fullName={expert.fullName}
                avatarUrl={expert.avatarUrl}
                rating={expert.rating}
                reviewCount={expert.reviewCount}
                completedOrdersCount={expert.completedOrdersCount}
                joinedAt={expert.joinedAt}
                lastOrder={expert.lastOrder}
              />
            ))}
          </div>

          {isLoadingMore && (
            <div className={s.loadMore}>
              <Loader label="" size="md" />
            </div>
          )}

          <div ref={sentinelRef} aria-hidden="true" />
        </>
      )}
    </div>
  );
}
