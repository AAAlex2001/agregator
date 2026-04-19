"use client";

import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OrderCard } from "@/source/entities/order";
import { Button, Loader, ScrollHintTooltip } from "@/shared/ui";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useNotifications } from "@/shared/ui/Notifications";
import { useHorizontalScroll } from "@/source/shared/lib/useHorizontalScroll";
import { OrderModal, useExpertOrders } from "@/source/features/expert-orders";
import { ExpertOrdersSkeleton } from "./ExpertOrdersSkeleton";
import s from "./ExpertOrdersWidget.module.scss";

const anim = {
  initial: { opacity: 0, y: -10, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.97 },
  transition: {
    layout: { type: "spring" as const, stiffness: 380, damping: 32 },
    opacity: { duration: 0.24 },
    y: { duration: 0.24 },
    scale: { duration: 0.24 },
  },
};

function isResponsesDeadlineExpired(responsesDeadline?: string | null): boolean {
  return responsesDeadline ? new Date(responsesDeadline) <= new Date() : false;
}

export function ExpertOrdersWidget() {
  const { showSuccess } = useNotifications();
  const h = useExpertOrders();
  const isEmpty = !h.isLoading && !h.error && h.items.length === 0;
  const showOrdersContent = h.isLoading || (!h.error && h.items.length > 0);

  const gridRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useHorizontalScroll(gridRef, {
    deps: [h.isLoading, h.isLoadingMore, h.hasMore, h.items.length],
    onReachEnd: () => void h.loadMore(),
    sentinelRef,
  });

  return (
    <div className={s.wrapper}>
      {showOrdersContent && (
        <div className={s.pageHead}>
          <div className={s.titleRow}>
            <Title text="Все заказы" as="h1" className={s.pageTitle} />
            <ScrollHintTooltip message="Используйте Shift + колесо мыши для прокрутки" />
          </div>
          <Subtitle text="Актуальные заказы по направлениям" className={s.pageSubtitle} />
        </div>
      )}

      {h.error && (
        <div className={s.center}>
          <Title text="Ошибка загрузки" as="h2" />
          <Subtitle text={h.error} />
          <button className={s.retry} onClick={() => void h.reload()}>Повторить</button>
        </div>
      )}

      {isEmpty && (
        <EmptyStateCard
          fullPage
          title="Пока нет доступных заказов"
          subtitle="Загляните позже — мы пришлём новые"
        />
      )}

      {showOrdersContent && (
        <>
          {h.isLoading ? (
            <ExpertOrdersSkeleton />
          ) : (
            <>
              <div className={s.container}>
                <div className={s.shadeL} />
                <div className={s.shadeR} />
                <div className={s.grid} ref={gridRef}>
                  <AnimatePresence initial={false} mode="popLayout">
                    {h.items.map((o) => (
                      <motion.div key={o.id} className={s.item} layout {...anim}>
                        <OrderCard
                          badges={o.badges}
                          title={o.title}
                          customer={o.customer}
                          date={o.date}
                          sum={o.sum}
                          responsesDeadline={o.responsesDeadline}
                          onClick={() => h.openDetails(o)}
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
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {h.isLoadingMore && (
                    <div className={s.loadMore}><Loader label="" size="md" /></div>
                  )}
                </div>
              </div>
              <div ref={sentinelRef} className={s.sentinel} aria-hidden="true" />
            </>
          )}
        </>
      )}

      <OrderModal
        isOpen={Boolean(h.selectedOrder)}
        order={h.selectedOrder}
        onClose={h.closeModal}
        onRespond={h.onRespond}
        onTopUp={h.onTopUp}
        balance={h.balance}
        isResponding={h.isResponding}
        initialStep={h.pendingStep}
      />
    </div>
  );
}
