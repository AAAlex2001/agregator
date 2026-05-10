"use client";

import { useRouter } from "next/navigation";
import {
  OrderCard,
  OrderCardSkeleton,
  usePublicOrdersList,
  type OrderCardData,
} from "@/source/entities/order";
import { CommentSection, TechSpecFiles } from "@/source/entities/response";
import { Loader } from "@/shared/ui";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { useSession } from "@/source/features/session";
import s from "./PublicOrdersWidget.module.scss";

export function PublicOrdersWidget() {
  const router = useRouter();
  const { showError } = useNotifications();
  const { user, role, isLoading: isSessionLoading } = useSession();

  const { items, total, isLoading, isLoadingMore, loadMore } = usePublicOrdersList({
    onError: showError,
  });

  const sentinelRef = useInfiniteScroll({
    hasMore: items.length < total,
    isLoading: isLoading || isLoadingMore,
    onLoadMore: () => void loadMore(),
  });

  const onCardClick = (order: OrderCardData) => {
    if (isSessionLoading) return;
    if (!user) return router.push("/register");
    if (role === "EXPERT") return router.push(`/expert/orders?orderId=${order.id}`);
    router.push("/customer/orders");
  };

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Актуальные заявки" as="h1" className={s.pageTitle} />
        <Subtitle
          text="Просматривайте задачи на платформе. Чтобы откликнуться, войдите или зарегистрируйтесь."
          className={s.pageSubtitle}
        />
      </div>

      {isLoading && (
        <div className={s.list}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <OrderCardSkeleton key={idx} showActions={false} />
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className={s.emptyState}>
          <EmptyStateCard
            title="Пока нет открытых заявок"
            subtitle="Загляните позже — новые задачи появляются регулярно"
          />
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <>
          <div className={s.list}>
            {items.map((order) => {
              const hasDetails = Boolean(order.comment) || order.technicalFiles.length > 0;
              return (
                <OrderCard
                  key={order.id}
                  id={order.id}
                  status={order.status}
                  badges={order.badges}
                  title={order.title}
                  customer={order.customer}
                  date={order.date}
                  sum={order.sum}
                  responsesDeadline={order.responsesDeadline}
                  createdAtDisplay={order.createdAtDisplay}
                  previousTitle={order.previousTitle}
                  previousSum={order.previousSum}
                  previousDate={order.previousDeadline}
                  previousBadges={order.previousBadges}
                  onClick={() => onCardClick(order)}
                  details={hasDetails ? (
                    <>
                      {order.comment && (
                        <CommentSection
                          title="Комментарий заказчика:"
                          text={order.comment}
                          previous={order.previousComment}
                        />
                      )}
                      {order.technicalFiles.length > 0 && (
                        <TechSpecFiles
                          title="Техническое задание:"
                          files={order.technicalFiles}
                          previousFiles={order.previousTechnicalFiles}
                        />
                      )}
                    </>
                  ) : undefined}
                />
              );
            })}
            {isLoadingMore && (
              <div className={s.loadMore}>
                <Loader label="" size="md" />
              </div>
            )}
          </div>
          <div ref={sentinelRef} className={s.sentinel} aria-hidden="true" />
        </>
      )}
    </div>
  );
}
