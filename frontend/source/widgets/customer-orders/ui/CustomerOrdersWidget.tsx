"use client";

import { Button } from "@/shared/ui";
import { CustomerActiveCard } from "./CustomerActiveCard";
import { EmptyStateCard } from "@/source/shared/ui";
import Skeleton from "@/source/shared/ui/Skeleton";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { CreateOrderForm } from "@/source/features/customer-orders/ui/create-order-form";
import { useCustomerOrders } from "@/source/features/customer-orders";
import { CustomerOrdersSkeleton } from "./CustomerOrdersSkeleton";
import s from "./CustomerOrdersWidget.module.scss";

export function CustomerOrdersWidget() {
  const h = useCustomerOrders();
  const showOrdersContent = h.isLoading || (!h.error && h.items.length > 0);

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

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Мои заказы" as="h1" className={s.pageTitle} />
        <Subtitle text="Актуальные заказы по направлениям" className={s.pageSubtitle} />
      </div>

      {h.error && (
        <div className={s.center}>
          <Title text="Ошибка загрузки" as="h2" />
          <Subtitle text={h.error} />
          <button className={s.retry} onClick={() => void h.reload()}>Повторить</button>
        </div>
      )}

      {!h.isLoading && !h.error && h.items.length === 0 && (
        <div className={s.emptyState}>
          <EmptyStateCard
            title="Вы ещё не создали ни одного заказа"
            subtitle="Опубликуйте заказ, чтобы получить отклики от экспертов по промышленной безопасности"
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
            <Button variant="primary" size="md" fullWidth className={s.createBtn} onClick={h.openCreate}>
              Добавить заказ
            </Button>
          )}

          {h.isLoading ? (
            <CustomerOrdersSkeleton />
          ) : (
            <div className={s.list}>
              {h.items.map((o) => (
                <CustomerActiveCard
                  key={o.id}
                  card={o}
                  isDeleting={h.deletingId === o.id}
                  onEdit={() => h.openEdit(o)}
                  onDelete={() => void h.onDelete(o.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
