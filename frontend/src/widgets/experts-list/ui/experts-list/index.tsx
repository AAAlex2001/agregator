"use client";

import {
  ExpertCard,
  ExpertCardSkeleton,
  useExpertsList,
} from "@/entities/expert";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { ExpertsSort } from "../experts-sort";
import { LastOrderSummary } from "../last-order-summary";
import { LastOrderTerms } from "../last-order-terms";
import styles from "./style.module.scss";

/** Показывает исполнителей с отзывами, их последний заказ и догружает список. */
export function ExpertsList() {
  const experts = useExpertsList();
  const sentinelRef = useInfiniteScroll({
    hasMore: experts.page?.has_more ?? false,
    isLoading: experts.isLoading || experts.isLoadingMore,
    onLoadMore: experts.loadMore,
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.pageHead}>
        <Title
          text="Отзывы исполнителей"
          as="h1"
          className={styles.pageTitle}
        />
        <Subtitle
          text={
            "Карточки аттестованных исполнителей платформы. "
            + "Посмотрите отзывы заказчиков и историю выполненных заказов."
          }
          className={styles.pageSubtitle}
        />
      </div>

      <ExpertsSort
        sort={experts.sort}
        isLoading={experts.isLoading}
        onChange={experts.changeSort}
      />

      {experts.error ? (
        <div className={styles.statusState}>
          <EmptyState
            title="Не удалось загрузить исполнителей"
            subtitle={experts.error}
            actionLabel="Повторить"
            onAction={experts.reload}
          />
        </div>
      ) : !experts.page ? (
        <div className={styles.list}>
          <ExpertCardSkeleton />
          <ExpertCardSkeleton />
          <ExpertCardSkeleton />
        </div>
      ) : experts.page.items.length === 0 ? (
        <div className={styles.statusState}>
          <EmptyState
            title="Пока нет исполнителей с отзывами"
            subtitle="Здесь появятся аттестованные исполнители, получившие отзывы от заказчиков"
          />
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {experts.page.items.map((expert) => (
              <ExpertCard
                key={expert.public_id}
                publicId={expert.public_id}
                fullName={expert.full_name}
                avatarUrl={expert.avatar_url}
                rating={expert.rating}
                reviewCount={expert.review_count}
                completedOrdersCount={expert.completed_orders_count}
                joinedAt={expert.joined_at}
                details={<LastOrderSummary order={expert.last_order} />}
                aside={
                  expert.last_order && <LastOrderTerms order={expert.last_order} />
                }
              />
            ))}
          </div>
          {experts.isLoadingMore && (
            <div className={styles.loadMore}>
              <Loader
                label=""
                size="md"
              />
            </div>
          )}
          <div
            ref={sentinelRef}
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
}
