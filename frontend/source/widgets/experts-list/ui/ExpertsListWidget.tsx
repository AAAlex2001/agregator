"use client";

import Button from "@/source/shared/ui/Button";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Loader from "@/source/shared/ui/Loader";
import Skeleton from "@/source/shared/ui/Skeleton";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { ExpertCard, useExpertsList } from "@/source/entities/expert";
import s from "./ExpertsListWidget.module.scss";

const SKELETON_COUNT = 6;

export function ExpertsListWidget() {
  const { items, hasMore, isLoading, isLoadingMore, error, reload, loadMore } = useExpertsList();
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

      {isLoading ? (
        <div className={s.grid}>
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
            title="Пока нет экспертов"
            subtitle="Здесь появятся карточки аттестованных экспертов платформы"
          />
        </div>
      ) : (
        <>
          <div className={s.grid}>
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
              />
            ))}
          </div>

          {isLoadingMore && (
            <div className={s.loadMore}>
              <Loader label="" size="md" />
            </div>
          )}

          {!isLoadingMore && !hasMore && (
            <Button
              variant="transparent"
              size="sm"
              className={s.endHint}
              onClick={() => void reload()}
            >
              Обновить список
            </Button>
          )}

          <div ref={sentinelRef} aria-hidden="true" />
        </>
      )}
    </div>
  );
}
