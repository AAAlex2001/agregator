"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OrderCard, OrderCardSkeleton, mapApiToOrderCard } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";
import { CommentSection, TechSpecFiles } from "@/source/entities/response";
import { Loader } from "@/shared/ui";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { useSession } from "@/source/features/session";
import { fetchOrders } from "@/source/features/expert-orders";
import s from "./PublicOrdersWidget.module.scss";

const PAGE = 50;

export function PublicOrdersWidget() {
  const router = useRouter();
  const { showError } = useNotifications();
  const { user, role, isLoading: isSessionLoading } = useSession();

  const [items, setItems] = useState<OrderCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchOrders(0, PAGE)
      .then((data) => {
        if (cancelled) return;
        setItems(data.items.map(mapApiToOrderCard));
        setTotal(data.total);
      })
      .catch((error) => {
        if (cancelled) return;
        showError(error instanceof Error ? error.message : "Не удалось загрузить заказы");
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasMore = items.length < total;

  const loadMore = async () => {
    if (isLoading || isLoadingMore || loadingMoreRef.current || !hasMore) return;
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      const data = await fetchOrders(items.length, PAGE);
      setItems((prev) => [...prev, ...data.items.map(mapApiToOrderCard)]);
      setTotal(data.total);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось загрузить заказы");
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  };

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoading || isLoadingMore,
    onLoadMore: () => void loadMore(),
  });

  const onCardClick = (order: OrderCardData) => {
    if (isSessionLoading) return;
    if (!user) {
      router.push("/register");
      return;
    }
    if (role === "EXPERT") {
      router.push(`/expert/orders?orderId=${order.id}`);
      return;
    }
    router.push("/customer/orders");
  };

  const isEmpty = !isLoading && items.length === 0;

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

      {isEmpty && (
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
