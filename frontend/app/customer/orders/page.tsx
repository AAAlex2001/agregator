"use client";

import AuthHeader from "@/app/landing/header/AuthHeader";
import OrderCard from "@/app/expert/orders/components/OrderCard";
import { Button, Loader, ScrollHintTooltip, Title, Subtitle } from "@/app/components";
import EmptyState from "./components/EmptyState";
import CreateOrderForm from "./components/CreateOrderForm";
import { useCustomerOrdersPage } from "./utils/useCustomerOrdersPage";
import styles from "./customerOrders.module.scss";

export default function CustomerOrdersPage() {
  const {
    items,
    isLoading,
    error,
    showCreateForm,
    isSubmitting,
    setShowCreateForm,
    handleCreateOrder,
    fetchOrders,
    ordersRef,
  } = useCustomerOrdersPage();

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
                    />
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
