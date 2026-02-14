"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AuthHeader from "@/app/landing/header/AuthHeader";
import OrderCard from "@/app/orders/components/OrderCard";
import { Loader, Title, Subtitle } from "@/app/components";
import { createResponseForOrder } from "@/app/responses/store/api";
import OrderDetailsModal from "./components/OrderDetailsModal";
import { loadOrders } from "./store/actions";
import { useOrdersState } from "./store/state";
import type { OrderCardViewModel } from "./store/types";
import styles from "./orders.module.scss";

export default function OrdersPage() {
  const {
    items,
    isLoading,
    error,
    setLoading,
    setError,
    setOrders,
    setTotal,
  } = useOrdersState();
  const ordersRef = useRef<HTMLDivElement | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderCardViewModel | null>(null);
  const [isResponding, setIsResponding] = useState(false);

  const parseSumAmount = useCallback((sum: string): number => {
    const normalized = sum.replace("₽", "").replace(/\s+/g, "").replace(",", ".").trim();
    const amount = Number(normalized);
    if (!Number.isFinite(amount) || amount <= 0) {
      return 100;
    }
    return Math.round(amount * 100);
  }, []);

  const parseDateToIso = useCallback((date: string): string => {
    const [day, month, year] = date.split(".");
    if (!day || !month || !year) {
      return new Date().toISOString().slice(0, 10);
    }
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }, []);

  const fetchOrdersData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await loadOrders(
        ({ items, total }) => {
          setOrders(items);
          setTotal(total);
        },
        (error) => {
          setError(error);
        }
      );
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setOrders, setTotal]);

  const handleRespondToOrder = useCallback(
    async (order: OrderCardViewModel) => {
      setIsResponding(true);
      try {
        await createResponseForOrder(order.id, {
          comment: order.comment,
          proposed_sum_amount: parseSumAmount(order.sum),
          proposed_deadline: parseDateToIso(order.date),
        });
        await fetchOrdersData();
        setSelectedOrder(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Не удалось отправить отклик";
        setError(message);
      } finally {
        setIsResponding(false);
      }
    },
    [fetchOrdersData, parseDateToIso, parseSumAmount, setError]
  );

  const handleOrdersWheel = useCallback((event: { deltaX: number; deltaY: number; deltaMode: number; preventDefault: () => void; }) => {
    const element = ordersRef.current;
    if (!element) return;

    const maxScroll = element.scrollWidth - element.clientWidth;
    if (maxScroll <= 0) return;

    const PIXEL_MULTIPLIER = 2;
    const LINE_HEIGHT = 40;

    event.preventDefault();

    let delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;

    if (event.deltaMode === 1) {
      delta *= LINE_HEIGHT;
    } else if (event.deltaMode === 2) {
      delta *= element.clientWidth;
    }

    delta *= PIXEL_MULTIPLIER;

    element.scrollLeft = Math.max(0, Math.min(element.scrollLeft + delta, maxScroll));
  }, []);

  useEffect(() => {
    void fetchOrdersData();
  }, [fetchOrdersData]);

  useEffect(() => {
    const element = ordersRef.current;
    if (!element) {
      return;
    }

    const handleWheelScroll = (event: WheelEvent) => {
      handleOrdersWheel(event);
    };

    element.addEventListener("wheel", handleWheelScroll, { passive: false, capture: true });

    return () => {
      element.removeEventListener("wheel", handleWheelScroll, { capture: true });
    };
  }, [handleOrdersWheel]);

  return (
    <>
      <AuthHeader
        name="Иван Иванов"
        rating={4.8}
        reviewCount={12}
        role="Эксперт"
        balance="150 000"
      />
      <div className={styles.wrapper}>
        <div className={styles.pageHead}>
          <Title text="Все заказы" className={styles.pageTitle} as="h1" />
          <Subtitle text="Актуальные заказы по направлениям" className={styles.pageSubtitle} />
        </div>

        {isLoading && (
          <div className={styles.statusState}>
            <Loader label="" size="lg" />
          </div>
        )}

        {!isLoading && error && (
          <div className={styles.statusState}>
            <Title text="Ошибка загрузки" className={styles.statusTitle} as="h2" />
            <Subtitle text={error} className={styles.statusSubtitle} />
            <button className={styles.retryButton} onClick={() => void fetchOrdersData()}>
              Повторить
            </button>
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className={styles.statusState}>
            <Title text="Все заказы" className={styles.statusTitle} as="h2" />
            <Subtitle text="Пока нет заказов" className={styles.statusSubtitle} />
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className={styles.ordersContainer}>
            <div className={styles.shadeLeft} />
            <div className={styles.shadeRight} />
            <div className={styles.orders} ref={ordersRef} onWheelCapture={handleOrdersWheel}>
              {items.map((order) => (
                <OrderCard
                  key={order.id}
                  badges={order.badges}
                  title={order.title}
                  customer={order.customer}
                  date={order.date}
                  sum={order.sum}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          </div>
        )}

        <OrderDetailsModal
          isOpen={Boolean(selectedOrder)}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRespond={handleRespondToOrder}
          isResponding={isResponding}
        />
      </div>
    </>
  );
}
