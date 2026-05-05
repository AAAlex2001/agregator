"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { OrderCard, mapApiToOrderCard } from "@/source/entities/order";
import type { OrderCardData } from "@/source/entities/order";
import { Loader } from "@/shared/ui";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { useSession } from "@/source/features/session";
import { fetchOrders } from "@/source/features/expert-orders";
import { useHorizontalScroll } from "@/source/shared/lib/useHorizontalScroll";
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

  const gridRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  useHorizontalScroll(gridRef, {
    deps: [isLoading, isLoadingMore, hasMore, items.length],
    onReachEnd: () => void loadMore(),
    sentinelRef,
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
        <div className={s.center}>
          <Loader label="" size="md" />
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
          <div className={s.container}>
            <div className={s.grid} ref={gridRef}>
              {items.map((order) => (
                <div key={order.id} className={s.item}>
                  <OrderCard
                    badges={order.badges}
                    title={order.title}
                    customer={order.customer}
                    date={order.date}
                    sum={order.sum}
                    responsesDeadline={order.responsesDeadline}
                    onClick={() => onCardClick(order)}
                  />
                </div>
              ))}
              {isLoadingMore && (
                <div className={s.loadMore}>
                  <Loader label="" size="md" />
                </div>
              )}
            </div>
          </div>
          <div ref={sentinelRef} className={s.sentinel} aria-hidden="true" />
        </>
      )}
    </div>
  );
}
