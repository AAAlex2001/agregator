"use client";

import AuthHeader from "@/app/landing/header/AuthHeader";
import OrderCard from "@/app/expert/orders/components/OrderCard";
import { Loader, ScrollHintTooltip, Subtitle, Title } from "@/app/components";
import OrderDetailsModal from "./components/OrderDetailsModal";
import { useOrdersPage } from "./utils/useOrdersPage";
import styles from "./orders.module.scss";

export default function OrdersPage() {
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
  } = useOrdersPage();

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
                {items.map((order) => (
                  <div key={order.id} style={{ height: "100%" }}>
                    <OrderCard
                      badges={order.badges}
                      title={order.title}
                      customer={order.customer}
                      date={order.date}
                      sum={order.sum}
                      onClick={() => setSelectedOrder(order)}
                    />
                  </div>
                ))}
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
          isResponding={isResponding}
        />
      </div>
    </>
  );
}
