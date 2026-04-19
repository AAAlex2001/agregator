"use client";

import { useRef } from "react";
import { OrderCard } from "@/source/entities/order";
import { Button, ScrollHintTooltip } from "@/shared/ui";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useHorizontalScroll } from "@/source/shared/lib/useHorizontalScroll";
import { CreateOrderForm } from "@/source/features/customer-orders/ui/create-order-form";
import { useCustomerOrders } from "@/source/features/customer-orders";
import { CustomerOrdersSkeleton } from "./CustomerOrdersSkeleton";
import s from "./CustomerOrdersWidget.module.scss";

export function CustomerOrdersWidget() {
  const h = useCustomerOrders();
  const ref = useRef<HTMLDivElement>(null);
  useHorizontalScroll(ref, { deps: [h.isLoading] });

  if (h.mode === "create" || h.mode === "edit") {
    return (
      <div className={s.wrapper}>
        <CreateOrderForm
          onCancel={h.backToList}
          onSubmit={h.mode === "edit"
            ? (values, files, keepFiles) => h.onUpdate(values, files, keepFiles ?? [])
            : (values, files) => h.onCreate(values, files)}
          isSubmitting={h.submitting}
          editTarget={h.editTarget ?? undefined}
        />
      </div>
    );
  }

  if (h.isLoading) {
    return <CustomerOrdersSkeleton />;
  }

  return (
    <div className={s.wrapper}>
      {h.error && (
        <div className={s.center}>
          <Title text="Ошибка загрузки" as="h2" />
          <Subtitle text={h.error} />
          <button className={s.retry} onClick={() => void h.reload()}>Повторить</button>
        </div>
      )}

      {!h.error && h.items.length === 0 && (
        <EmptyStateCard
          fullPage
          title="Вы ещё не создали ни одного заказа"
          subtitle="Опубликуйте заказ, чтобы получить отклики от экспертов по промышленной безопасности"
          actionLabel="Добавить заказ"
          onAction={h.openCreate}
        />
      )}

      {!h.error && h.items.length > 0 && (
        <>
          <div className={s.pageHead}>
            <div className={s.titleRow}>
              <Title text="Мои заказы" as="h1" className={s.pageTitle} />
              <ScrollHintTooltip message="Используйте Shift + колесо мыши для прокрутки" />
            </div>
            <Subtitle text="Актуальные заказы по направлениям" className={s.pageSubtitle} />
          </div>

          <Button variant="primary" size="md" fullWidth className={s.createBtn} onClick={h.openCreate}>
            Добавить заказ
          </Button>

          <div className={s.container}>
            <div className={s.shadeL} /><div className={s.shadeR} />
            <div className={s.grid} ref={ref}>
              {h.items.map((o) => (
                <OrderCard
                  key={o.id}
                  badges={o.badges}
                  title={o.title}
                  customer={o.customer}
                  date={o.date}
                  sum={o.sum}
                  responsesDeadline={o.responsesDeadline}
                >
                  <Button variant="outline" size="sm" className={s.btn} onClick={(e) => { e.stopPropagation(); h.openEdit(o); }}>
                    Редактировать
                  </Button>
                  <Button variant="transparent" size="sm" className={s.btnDel}
                    disabled={h.deletingId === o.id} isLoading={h.deletingId === o.id}
                    onClick={(e) => { e.stopPropagation(); void h.onDelete(o.id); }}
                  >Удалить</Button>
                </OrderCard>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
