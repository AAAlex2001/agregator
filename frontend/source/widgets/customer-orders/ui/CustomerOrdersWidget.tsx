"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/source/shared/ui";
import { CustomerActiveCard } from "./CustomerActiveCard";
import { EmptyStateCard } from "@/source/shared/ui";
import Skeleton from "@/source/shared/ui/Skeleton";
import Loader from "@/source/shared/ui/Loader";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { DraftCard, DraftSection } from "@/source/entities/draft";
import { CreateOrderForm } from "@/source/features/customer-orders/ui/create-order-form";
import { useCustomerOrders } from "@/source/features/customer-orders";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { CustomerOrdersSkeleton } from "./CustomerOrdersSkeleton";
import s from "./CustomerOrdersWidget.module.scss";
import type { OrderCardData } from "@/source/entities/order";
import { OrderCopyPicker } from "@/source/features/customer-orders/ui/OrderCopyPicker/OrderCopyPicker";

export function CustomerOrdersWidget() {
  const h = useCustomerOrders();
  const [copyPickerOpen, setCopyPickerOpen] = useState(false);
  const [copyTemplate, setCopyTemplate] = useState<OrderCardData | null>(null);
  const returnAnchor = useRef<{ id: number; top: number } | null>(null);
  const showOrdersContent = h.isLoading || (!h.error && h.items.length > 0);
  const sentinelRef = useInfiniteScroll({
    hasMore: h.hasMore,
    isLoading: h.isLoading || h.isLoadingMore,
    onLoadMore: () => void h.loadMore(),
  });

  useEffect(() => {
    const anchor = returnAnchor.current;
    if (h.mode !== "list" || h.isLoading || !anchor) return;
    requestAnimationFrame(() => {
      const card = document.querySelector<HTMLElement>(`[data-customer-order-id="${anchor.id}"]`);
      if (!card) return;
      window.scrollBy({ top: card.getBoundingClientRect().top - anchor.top });
      returnAnchor.current = null;
    });
  }, [h.mode, h.isLoading, h.items]);

  const openEdit = (order: OrderCardData) => {
    const card = document.querySelector<HTMLElement>(`[data-customer-order-id="${order.id}"]`);
    returnAnchor.current = { id: order.id, top: card?.getBoundingClientRect().top ?? 24 };
    setCopyTemplate(null);
    h.openEdit(order);
  };

  const chooseCopy = (order: OrderCardData) => {
    setCopyTemplate(order);
    setCopyPickerOpen(false);
    if (h.mode === "list") h.openCreate();
  };

  if (h.mode === "create" || h.mode === "edit") {
    return (
      <div className={s.wrapper}>
        <CreateOrderForm
          key={`${h.mode}-${h.editTarget?.id ?? "new"}-${copyTemplate?.id ?? "original"}`}
          onCancel={h.backToList}
          onSubmit={h.mode === "edit" ? h.onUpdate : h.onCreate}
          isSubmitting={h.submitting}
          editTarget={h.editTarget ?? undefined}
          copyTemplate={copyTemplate ?? undefined}
          onCopy={() => setCopyPickerOpen(true)}
        />
        <OrderCopyPicker
          open={copyPickerOpen}
          customerId={h.customerId}
          onClose={() => setCopyPickerOpen(false)}
          onSelect={chooseCopy}
        />
      </div>
    );
  }

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Мои заказы" as="h1" className={s.pageTitle} />
        <Subtitle text="Актуальные заказы по направлениям" className={s.pageSubtitle} />
      </div>

      {h.draft && (
        <DraftSection title="Незавершённый заказ">
          <DraftCard
            meta="Новый заказ"
            title={h.draft.title}
            titleLabel="Название заказа:"
            rightItems={[
              ...(h.draft.budget
                ? [{ label: "Начальная максимальная цена", value: h.draft.budget, accent: true }]
                : []),
              ...(h.draft.startDate
                ? [{ label: "Срок начала выполнения работ", value: h.draft.startDate }]
                : []),
              ...(h.draft.deadline
                ? [{ label: "Срок окончания выполнения работ", value: h.draft.deadline }]
                : []),
            ]}
            onContinue={h.openCreate}
            onDelete={h.dismissDraft}
          />
        </DraftSection>
      )}

      {h.error && (
        <div className={s.center}>
          <Title text="Ошибка загрузки" as="h2" />
          <Subtitle text={h.error} />
          <button className={s.retry} onClick={() => void h.reload()}>Повторить</button>
        </div>
      )}

      {!h.isLoading && !h.error && h.items.length === 0 && !h.draft && (
        <div className={s.emptyState}>
          <EmptyStateCard
            title="Вы ещё не создали ни одного заказа"
            subtitle="Опубликуйте заказ, чтобы получить отклики от исполнителей по промышленной безопасности"
            actionLabel="Добавить заказ"
            onAction={h.openCreate}
          />
        </div>
      )}

      {showOrdersContent && (
        <>
          {h.isLoading ? (
            <Skeleton className={s.createBtn} rounded="md" />
          ) : (
            <div className={s.createActions}>
              <Button variant="primary" size="md" fullWidth className={s.createBtn} onClick={() => {
                setCopyTemplate(null);
                h.openCreate();
              }}>
                Добавить заказ
              </Button>
              <Button variant="outlineOrange" size="md" fullWidth className={s.createBtn} onClick={() => setCopyPickerOpen(true)}>
                Скопировать заявку
              </Button>
            </div>
          )}

          {h.isLoading ? (
            <CustomerOrdersSkeleton />
          ) : (
            <>
              <div className={s.list}>
                {h.items.map((o) => (
                  <div key={o.id} data-customer-order-id={o.id}>
                    <CustomerActiveCard
                      card={o}
                      isDeleting={h.deletingId === o.id}
                      onEdit={() => openEdit(o)}
                      onDelete={() => void h.onDelete(o.id)}
                    />
                  </div>
                ))}
                {h.isLoadingMore && (
                  <div className={s.loadMore}>
                    <Loader label="" size="md" />
                  </div>
                )}
              </div>
              <div ref={sentinelRef} aria-hidden="true" />
            </>
          )}
        </>
      )}
      <OrderCopyPicker
        open={copyPickerOpen}
        customerId={h.customerId}
        onClose={() => setCopyPickerOpen(false)}
        onSelect={chooseCopy}
      />
    </div>
  );
}
