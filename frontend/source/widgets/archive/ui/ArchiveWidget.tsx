"use client";

import { useArchive } from "@/source/features/archive-orders";
import { ResponsesSwiper } from "@/widgets/responses-swiper";
import { ResponsesSkeleton } from "@/source/widgets/responses/ui/ResponsesSkeleton";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { AddReviewModalContainer } from "@/source/features/reviews";
import { ArchivedCard } from "./ArchivedCard";
import s from "./ArchiveWidget.module.scss";

export function ArchiveWidget() {
  const { showSuccess, showError } = useNotifications();
  const {
    items, isLoading, error,
    reviewTarget, canLeaveReviewFor,
    openReview, closeReview, submitReview,
  } = useArchive();

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Архив заказов" as="h1" className={s.pageTitle} />
        <Subtitle text="Здесь находятся завершенные заказы" className={s.pageSubtitle} />
      </div>

      <div className={s.contentArea}>
        <div className={s.contentBody}>
          {isLoading ? (
            <ResponsesSkeleton compact hideTabs />
          ) : error ? (
            <div className={s.empty}>
              <EmptyStateCard title="Ошибка загрузки" subtitle={error} />
            </div>
          ) : items.length === 0 ? (
            <div className={s.empty}>
              <EmptyStateCard title="Архив пуст" subtitle="Здесь будут завершённые заказы" />
            </div>
          ) : (
            <ResponsesSwiper
              items={items}
              getKey={(item) => item.id}
              renderItem={(item) => (
                <ArchivedCard
                  card={item}
                  canLeaveReview={canLeaveReviewFor(item)}
                  onLeaveReview={() => openReview(item)}
                />
              )}
            />
          )}
        </div>
      </div>

      <AddReviewModalContainer
        isOpen={reviewTarget !== null}
        customerName={reviewTarget?.customer ?? ""}
        orderTitle={reviewTarget?.title ?? ""}
        expertName={reviewTarget?.executorName ?? ""}
        onClose={closeReview}
        onSubmit={async (payload) => {
          try {
            await submitReview(payload);
            showSuccess("Отзыв успешно опубликован");
          } catch (e) {
            showError(e instanceof Error ? e.message : "Не удалось оставить отзыв");
          }
        }}
      />
    </div>
  );
}
