"use client";

import AuthHeader from "@/app/landing/header/AuthHeader";
import OrderCard from "@/app/expert/orders/components/OrderCard";
import { Button, Loader, Title, Subtitle } from "@/app/components";
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
  } = useCustomerOrdersPage();

  return (
    <>
      <AuthHeader
        name="Иван Иванов"
        rating={4.8}
        reviewCount={12}
        balance="150 000"
      />

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
                  <Title text="Мои заказы" className={styles.pageTitle} as="h1" />
                  <Subtitle text="Актуальные заказы по направлениям" className={styles.pageSubtitle} />
                </div>
                <div className={styles.createButtonWrap}>
                  <Button
                    variant="primary"
                    size="md"
                    className={styles.createButton}
                    onClick={() => setShowCreateForm(true)}
                  >
                    Добавить заказ
                  </Button>
                </div>
                <div className={styles.ordersContainer}>
                  <div className={styles.shadeLeft} />
                  <div className={styles.shadeRight} />
                  <div className={styles.orders}>
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
