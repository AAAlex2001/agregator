"use client";

import AuthHeader from "@/app/landing/header/AuthHeader";
import { Button, Loader, Title, Subtitle } from "@/app/components";
import EmptyState from "./components/EmptyState";
import CreateOrderForm from "./components/CreateOrderForm";
import { useCustomerOrdersPage } from "./utils/useCustomerOrdersPage";
import styles from "./customerOrders.module.scss";

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  BLUE: { bg: "#E3F2FD", color: "#1565C0" },
  GREEN: { bg: "#E8F5E9", color: "#2E7D32" },
  GRAY: { bg: "#F5F5F5", color: "#78909C" },
  ORANGE: { bg: "#FFF3E0", color: "#E65100" },
  BROWN: { bg: "#EFEBE9", color: "#6D4C41" },
};

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
                </div>
                <div className={styles.createButtonWrap}>
                  <Button
                    variant="primary"
                    size="md"
                    className={styles.createButton}
                    onClick={() => setShowCreateForm(true)}
                  >
                    Создать заказ
                  </Button>
                </div>
                <div className={styles.ordersList}>
                  {items.map((order) => (
                    <div key={order.id} className={styles.orderItem}>
                      <span className={styles.orderTitle}>{order.title}</span>
                      <div className={styles.orderMeta}>
                        <span>{order.date}</span>
                        <span className={styles.orderSum}>{order.sum}</span>
                        {order.company && <span>{order.company}</span>}
                      </div>
                      {order.badges.length > 0 && (
                        <div className={styles.orderBadges}>
                          {order.badges.map((badge, i) => {
                            const colors = BADGE_COLORS[badge.variant] ?? BADGE_COLORS.BLUE;
                            return (
                              <span
                                key={i}
                                className={styles.orderBadge}
                                style={{ background: colors.bg, color: colors.color }}
                              >
                                {badge.text}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
