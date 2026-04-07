"use client";

import { useRef } from "react";
import AuthHeader from "@/widgets/header/AuthHeader";
import OrderCard from "@/entities/order/ui/OrderCard";
import { Button, Loader, ScrollHintTooltip, Title, Subtitle } from "@/shared/ui";
import { useHorizontalScroll } from "@/shared/lib/hooks/useHorizontalScroll";
import EmptyState from "@/features/order/list-customer/ui/EmptyState";
import CreateOrderForm from "@/features/order/create/ui/CreateOrderForm";
import { useCustomerOrdersState } from "@/features/order/list-customer/model/state";
import styles from "./customer-orders.module.scss";

export function CustomerOrdersContent() {
  const s = useCustomerOrdersState();
  const ordersRef = useRef<HTMLDivElement | null>(null);

  useHorizontalScroll(ordersRef, { deps: [s.isLoading] });

  if (s.editingOrder) {
    return (
      <><AuthHeader /><div className={styles.wrapper}>
        <CreateOrderForm onCancel={() => s.setEditingOrder(null)} onSubmit={s.onUpdate} isSubmitting={s.isSubmitting} initialData={s.editingOrder} />
      </div></>
    );
  }

  return (
    <><AuthHeader /><div className={styles.wrapper}>
      {s.showCreateForm ? (
        <CreateOrderForm onCancel={() => s.setShowCreateForm(false)} onSubmit={s.onCreate} isSubmitting={s.isSubmitting} />
      ) : (
        <>
          {s.isLoading && <div className={styles.statusState}><Loader label="" size="lg" /></div>}

          {!s.isLoading && s.error && (
            <div className={styles.statusState}>
              <Title text="Ошибка загрузки" as="h2" />
              <Subtitle text={s.error} />
              <button onClick={() => void s.fetchOrders()}>Повторить</button>
            </div>
          )}

          {!s.isLoading && !s.error && s.items.length === 0 && (
            <EmptyState onCreateOrder={() => s.setShowCreateForm(true)} />
          )}

          {!s.isLoading && !s.error && s.items.length > 0 && (
            <>
              <div className={styles.pageHead}>
                <div className={styles.titleRow}>
                  <Title text="Мои заказы" className={styles.pageTitle} as="h1" />
                  <ScrollHintTooltip message="Используйте Shift + колесо мыши для прокрутки карточек заказов" />
                </div>
                <Subtitle text="Актуальные заказы по направлениям" className={styles.pageSubtitle} />
              </div>
              <Button variant="primary" size="md" fullWidth className={styles.createButton} onClick={() => s.setShowCreateForm(true)}>
                Добавить заказ
              </Button>
              <div className={styles.ordersContainer}>
                <div className={styles.shadeLeft} />
                <div className={styles.shadeRight} />
                <div className={styles.orders} ref={ordersRef}>
                  {s.items.map((order) => (
                    <OrderCard key={order.id} badges={order.badges} title={order.title} customer={order.customer} date={order.date} sum={order.sum}>
                      <Button variant="outline" size="sm" className={styles.actionBtn}
                        onClick={(e) => { e.stopPropagation(); s.onEdit(order); }}
                      >Редактировать</Button>
                      <Button variant="transparent" size="sm" className={styles.deleteBtnStyled}
                        disabled={s.isDeleting === order.id} isLoading={s.isDeleting === order.id}
                        onClick={(e) => { e.stopPropagation(); void s.onDelete(order.id); }}
                      >Удалить</Button>
                    </OrderCard>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div></>
  );
}
