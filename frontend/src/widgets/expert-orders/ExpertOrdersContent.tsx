"use client";

import { useRef } from "react";
import AuthHeader from "@/widgets/header/AuthHeader";
import { AnimatePresence, motion } from "framer-motion";
import OrderCard from "@/entities/order/ui/OrderCard";
import { Button, Loader, ScrollHintTooltip, Subtitle, Title } from "@/shared/ui";
import { useNotifications } from "@/shared/ui/Notifications";
import { useHorizontalScroll } from "@/shared/lib/hooks/useHorizontalScroll";
import OrderDetailsModal from "@/features/order/details/ui/OrderDetailsModal";
import { useExpertOrdersState } from "@/features/order/list-expert/model/state";
import styles from "./expert-orders.module.scss";

export function ExpertOrdersContent() {
  const { showSuccess } = useNotifications();
  const s = useExpertOrdersState();

  const ordersRef = useRef<HTMLDivElement | null>(null);
  const loadMoreSentinelRef = useRef<HTMLDivElement | null>(null);

  useHorizontalScroll(ordersRef, {
    deps: [s.isLoading, s.isLoadingMore, s.hasMoreOrders, s.items.length, s.total],
    onReachEnd: () => void s.loadMore(),
    sentinelRef: loadMoreSentinelRef,
  });

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

        {s.isLoading && <div className={styles.statusState}><Loader label="" size="lg" /></div>}

        {!s.isLoading && s.error && (
          <div className={styles.statusState}>
            <Title text="Ошибка загрузки" className={styles.statusTitle} as="h2" />
            <Subtitle text={s.error} className={styles.statusSubtitle} />
            <button className={styles.retryButton} onClick={() => void s.reload()}>Повторить</button>
          </div>
        )}

        {!s.isLoading && !s.error && s.items.length === 0 && (
          <div className={styles.statusState}>
            <Title text="Все заказы" className={styles.statusTitle} as="h2" />
            <Subtitle text="Пока нет заказов" className={styles.statusSubtitle} />
          </div>
        )}

        {!s.isLoading && !s.error && s.items.length > 0 && (
          <>
            <div className={styles.ordersContainer}>
              <div className={styles.shadeLeft} />
              <div className={styles.shadeRight} />
              <div className={styles.orders} ref={ordersRef}>
                <AnimatePresence initial={false} mode="popLayout">
                  {s.items.map((order) => (
                    <motion.div key={order.id} className={styles.orderItem} layout
                      initial={{ opacity: 0, y: -10, scale: 0.97, filter: "blur(1px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -10, scale: 0.97, filter: "blur(1px)" }}
                      transition={{
                        layout: { type: "spring", stiffness: 380, damping: 32 },
                        opacity: { duration: 0.24, ease: "easeOut" }, y: { duration: 0.24, ease: "easeOut" },
                        scale: { duration: 0.24, ease: "easeOut" }, filter: { duration: 0.18, ease: "easeOut" },
                      }}
                    >
                      <OrderCard badges={order.badges} title={order.title} customer={order.customer}
                        date={order.date} sum={order.sum} responsesDeadline={order.responsesDeadline}
                        onClick={() => s.setSelectedOrder(order)}
                      >
                        <Button variant="outline" size="sm" className={styles.shareBtn}
                          onClick={(e) => { e.stopPropagation(); s.onShare(order.publicId, () => showSuccess("Ссылка скопирована")); }}
                        >
                          Поделиться
                        </Button>
                      </OrderCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {s.isLoadingMore && <div className={styles.loadMoreIndicator}><Loader label="" size="md" /></div>}
              </div>
            </div>
            <div ref={loadMoreSentinelRef} className={styles.mobileLoadMoreSentinel} aria-hidden="true" />
          </>
        )}

        <OrderDetailsModal
          isOpen={Boolean(s.selectedOrder)} order={s.selectedOrder}
          onClose={() => s.setSelectedOrder(null)} onRespond={s.onRespond} onTopUp={s.onTopUp}
          balance={s.balance} isResponding={s.isResponding}
          initialStep={s.returnOrderId === String(s.selectedOrder?.id) ? "step1" : "details"}
        />
      </div>
    </>
  );
}
