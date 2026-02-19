"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuthHeader from "@/app/landing/header/AuthHeader";
import { AnimatePresence, motion } from "framer-motion";
import OrderCard from "@/app/expert/orders/components/OrderCard";
import { Loader, ScrollHintTooltip, Subtitle, Title } from "@/app/components";
import OrderDetailsModal from "./components/OrderDetailsModal";
import { useOrdersPage } from "./utils/useOrdersPage";
import styles from "./orders.module.scss";

export default function OrdersPage() {
  const searchParams = useSearchParams();

  const {
    items,
    isLoading,
    error,
    isLoadingMore,
    selectedOrder,
    isResponding,
    ordersRef,
    loadMoreSentinelRef,
    fetchOrdersData,
    setSelectedOrder,
    handleRespondToOrder,
    handleTopUp,
    balance,
  } = useOrdersPage();

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const step = searchParams.get("step");
    if (orderId && step === "step2" && items.length > 0) {
      const order = items.find((o) => String(o.id) === orderId);
      if (order) setSelectedOrder(order);
    }
  }, [searchParams, items]);

  return (
    <>
      <AuthHeader />
      <div className={styles.wrapper}>
        <div className={styles.pageHead}>
          <div className={styles.titleRow}>
            <Title text="Все заказы" className={styles.pageTitle} as="h1" />
            <ScrollHintTooltip message="Используйте Shift + колесо мыши для прокрутки карточек заказов" />
          </div>
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
          <>
            <div className={styles.ordersContainer}>
              <div className={styles.shadeLeft} />
              <div className={styles.shadeRight} />
              <div className={styles.orders} ref={ordersRef}>
                <AnimatePresence initial={false} mode="popLayout">
                {items.map((order) => (
                  <motion.div
                    key={order.id}
                    className={styles.orderItem}
                    layout
                    initial={{ opacity: 0, y: -10, scale: 0.97, filter: "blur(1px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, scale: 0.97, filter: "blur(1px)" }}
                    transition={{
                      layout: { type: "spring", stiffness: 380, damping: 32 },
                      opacity: { duration: 0.24, ease: "easeOut" },
                      y: { duration: 0.24, ease: "easeOut" },
                      scale: { duration: 0.24, ease: "easeOut" },
                      filter: { duration: 0.18, ease: "easeOut" },
                    }}
                  >
                    <OrderCard
                      badges={order.badges}
                      title={order.title}
                      customer={order.customer}
                      date={order.date}
                      sum={order.sum}
                      onClick={() => setSelectedOrder(order)}
                    />
                  </motion.div>
                ))}
                </AnimatePresence>
                {isLoadingMore && (
                  <div className={styles.loadMoreIndicator}>
                    <Loader label="" size="md" />
                  </div>
                )}
              </div>
            </div>
            <div ref={loadMoreSentinelRef} className={styles.mobileLoadMoreSentinel} aria-hidden="true" />
          </>
        )}

        <OrderDetailsModal
          isOpen={Boolean(selectedOrder)}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onRespond={handleRespondToOrder}
          onTopUp={(amount) => selectedOrder && void handleTopUp(selectedOrder.id, amount)}
          balance={balance}
          isResponding={isResponding}
          initialStep={
            searchParams.get("orderId") === String(selectedOrder?.id) &&
            searchParams.get("step") === "step2"
              ? "step2"
              : "details"
          }
        />
      </div>
    </>
  );
}
