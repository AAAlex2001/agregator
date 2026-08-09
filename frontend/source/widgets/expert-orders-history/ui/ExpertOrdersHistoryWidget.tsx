"use client";

import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Loader from "@/source/shared/ui/Loader";
import Skeleton from "@/source/shared/ui/Skeleton";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { ArchivedCard, ArchivedCardSkeleton } from "@/source/widgets/archive";
import { useExpertOrdersHistory } from "@/source/entities/expert";
import s from "./ExpertOrdersHistoryWidget.module.scss";

interface Props {
  publicId: string;
}

const SKELETON_COUNT = 3;

export function ExpertOrdersHistoryWidget({ publicId }: Props) {
  const { expert, items, hasMore, isLoading, isLoadingMore, error, reload, loadMore } =
    useExpertOrdersHistory(publicId);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoading || isLoadingMore,
    onLoadMore: () => void loadMore(),
  });

  const isEmpty = !isLoading && !error && items.length === 0;
  const expertName = expert?.fullName ?? "исполнитель";

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="История заказов исполнителя" as="h1" className={s.pageTitle} />
        {isLoading ? (
          <Skeleton className={s.expertNameSkeleton} rounded="pill" />
        ) : (
          <Subtitle text={`Выполненные заказы: ${expertName}`} className={s.pageSubtitle} />
        )}
      </div>

      {isLoading ? (
        <div className={s.list}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <ArchivedCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className={s.empty}>
          <EmptyStateCard
            title="Не удалось загрузить заказы"
            subtitle={error}
            actionLabel="Повторить"
            onAction={() => void reload()}
          />
        </div>
      ) : isEmpty ? (
        <div className={s.empty}>
          <EmptyStateCard
            title="Пока нет выполненных заказов"
            subtitle="Здесь появятся завершённые тендеры с участием исполнителя"
          />
        </div>
      ) : (
        <>
          <div className={s.list}>
            {items.map((order) => (
              <ArchivedCard
                key={order.id}
                card={order}
                hideExpertHistoryLink
              />
            ))}
            {isLoadingMore && (
              <div className={s.loadMore}>
                <Loader label="" size="md" />
              </div>
            )}
          </div>
          <div ref={sentinelRef} aria-hidden="true" />
        </>
      )}
    </div>
  );
}
