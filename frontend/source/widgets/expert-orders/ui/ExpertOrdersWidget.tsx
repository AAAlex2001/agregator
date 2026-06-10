"use client";

import { DocumentsGallery, OrderCard, countDocuments } from "@/source/entities/order";
import { CommentSection } from "@/source/entities/response";
import { Button, Loader } from "@/source/shared/ui";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { OrderModal, useExpertOrders } from "@/source/features/expert-orders";
import { ExpertOrdersSkeleton } from "./ExpertOrdersSkeleton";
import { ResponseDraftsList } from "./ResponseDraftsList";
import s from "./ExpertOrdersWidget.module.scss";

function isResponsesDeadlineExpired(responsesDeadline?: string | null): boolean {
  return responsesDeadline ? new Date(responsesDeadline) <= new Date() : false;
}

export function ExpertOrdersWidget() {
  const { showSuccess } = useNotifications();
  const h = useExpertOrders();
  const isEmpty = !h.isLoading && h.items.length === 0;
  const sentinelRef = useInfiniteScroll({
    hasMore: h.hasMore,
    isLoading: h.isLoading || h.isLoadingMore,
    onLoadMore: () => void h.loadMore(),
  });

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Все заказы" as="h1" className={s.pageTitle} />
        <Subtitle text="Актуальные заказы по направлениям" className={s.pageSubtitle} />
      </div>

      <ResponseDraftsList onContinue={h.continueDraft} orders={h.items} />

      {isEmpty && (
        <div className={s.emptyState}>
          <EmptyStateCard
            title="Пока нет доступных заказов"
            subtitle="Загляните позже — мы пришлём новые"
          />
        </div>
      )}

      {(h.isLoading || h.items.length > 0) && (
        h.isLoading ? (
          <ExpertOrdersSkeleton />
        ) : (
          <>
            <div className={s.list}>
              {h.items.map((o) => {
                const hasDetails = Boolean(o.comment) || countDocuments(o.documents) > 0;
                return (
                <OrderCard
                  key={o.id}
                  id={o.id}
                  badges={o.badges}
                  title={o.title}
                  customer={o.customer}
                  customerInn={o.customerInn}
                  startDate={o.startDate}
                  date={o.date}
                  sum={o.sum}
                  responsesDeadline={o.responsesDeadline}
                  createdAtDisplay={o.createdAtDisplay}
                  previousTitle={o.previousTitle}
                  previousSum={o.previousSum}
                  previousDate={o.previousDeadline}
                  previousBadges={o.previousBadges}
                  onClick={() => h.openDetails(o)}
                  details={hasDetails ? (
                    <>
                      {o.comment && (
                        <CommentSection
                          title="Комментарий заказчика:"
                          text={o.comment}
                          previous={o.previousComment}
                        />
                      )}
                      {countDocuments(o.documents) > 0 && (
                        <DocumentsGallery documents={o.documents} />
                      )}
                    </>
                  ) : undefined}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className={s.btn}
                    onClick={(e) => {
                      e.stopPropagation();
                      h.onShare(o.publicId, () => showSuccess("Ссылка скопирована"));
                    }}
                  >
                    Поделиться
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className={s.btn}
                    disabled={isResponsesDeadlineExpired(o.responsesDeadline)}
                    onClick={(e) => {
                      e.stopPropagation();
                      h.openRespond(o);
                    }}
                  >
                    Откликнуться
                  </Button>
                </OrderCard>
                );
              })}
              {h.isLoadingMore && (
                <div className={s.loadMore}><Loader label="" size="md" /></div>
              )}
            </div>
            <div ref={sentinelRef} className={s.sentinel} aria-hidden="true" />
          </>
        )
      )}

      <OrderModal
        isOpen={Boolean(h.selectedOrder)}
        order={h.selectedOrder}
        onClose={h.closeModal}
        onRespond={h.onRespond}
        isResponding={h.isResponding}
        useDraft={h.useDraft}
      />
    </div>
  );
}
