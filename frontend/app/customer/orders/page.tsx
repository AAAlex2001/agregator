"use client";

import AuthHeader from "@/widgets/header/AuthHeader";
import OrderCard from "@/entities/order/ui/OrderCard";
import { Button, Loader, ScrollHintTooltip, Title, Subtitle } from "@/shared/ui";
import EmptyState from "@/features/order/list-customer/ui/EmptyState";
import CreateOrderForm from "@/features/order/create/ui/CreateOrderForm";
import { useCustomerOrdersPage } from "@/features/order/list-customer/lib/useCustomerOrdersPage";
import styles from "./customerOrders.module.scss";

export default function CustomerOrdersPage() {
  const {
    items,
    isLoading,
    error,
    showCreateForm,
    isSubmitting,
    editingOrder,
    isDeleting,
    setShowCreateForm,
    setEditingOrder,
    handleCreateOrder,
    handleEditOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    fetchOrders,
    ordersRef,
  } = useCustomerOrdersPage();

  if (editingOrder) {
    return (
      <>
        <AuthHeader />
        <div className={styles.wrapper}>
          <CreateOrderForm
            onCancel={() => setEditingOrder(null)}
            onSubmit={handleUpdateOrder}
            isSubmitting={isSubmitting}
            initialData={editingOrder}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <AuthHeader />

      <div className={styles.wrapper}>
        {showCreateForm ? (
          <CreateOrderForm
            onCancel={() => setShowCreateForm(false)}
            onSubmit={handleCreateOrder}
            isSubmitting={isSubmitting}
          />
        ) : (
          <>
            {isLoading && (
              <div className={styles.statusState}>
                <Loader label="" size="lg" />
              </div>
            )}

            {!isLoading && error && (
              <div className={styles.statusState}>
                <Title text="Ошибка загрузки" as="h2" />
                <Subtitle text={error} />
                <button onClick={() => void fetchOrders()}>Повторить</button>
              </div>
            )}

            {!isLoading && !error && items.length === 0 && (
              <EmptyState onCreateOrder={() => setShowCreateForm(true)} />
            )}

            {!isLoading && !error && items.length > 0 && (
              <>
                <div className={styles.pageHead}>
                  <div className={styles.titleRow}>
                    <Title text="Мои заказы" className={styles.pageTitle} as="h1" />
                    <ScrollHintTooltip message="Используйте Shift + колесо мыши для прокрутки карточек заказов" />
                  </div>
                  <Subtitle text="Актуальные заказы по направлениям" className={styles.pageSubtitle} />
                </div>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  className={styles.createButton}
                  onClick={() => setShowCreateForm(true)}
                >
                  Добавить заказ
                </Button>
                <div className={styles.ordersContainer}>
                  <div className={styles.shadeLeft} />
                  <div className={styles.shadeRight} />
                  <div className={styles.orders} ref={ordersRef}>
                  {items.map((order) => (
                    <OrderCard
                      key={order.id}
                      badges={order.badges}
                      title={order.title}
                      customer={order.customer}
                      date={order.date}
                      sum={order.sum}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className={styles.actionBtn}
                        onClick={(e) => { e.stopPropagation(); handleEditOrder(order); }}
                      >
                        Редактировать
                      </Button>
                      <Button
                        variant="transparent"
                        size="sm"
                        className={styles.deleteBtnStyled}
                        disabled={isDeleting === order.id}
                        isLoading={isDeleting === order.id}
                        onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.id); }}
                      >
                        Удалить
                      </Button>
                    </OrderCard>
                  ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
