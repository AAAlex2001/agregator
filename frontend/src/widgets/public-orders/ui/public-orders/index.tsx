"use client";

import { OrderListProvider, type OrderListPage } from "@/entities/order";
import { OrderSort } from "@/features/sort-orders";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { OrderList } from "../order-list";
import styles from "./style.module.scss";

/** Серверная страница заказов и переход после выбора карточки. */
interface PublicOrdersProps {
  initialPage: OrderListPage;
  onOpenOrder: (orderId: number) => void;
}

/** Собирает публичный список, сортировку и пояснение для посетителя. */
export function PublicOrders({ initialPage, onOpenOrder }: PublicOrdersProps) {
  return (
    <OrderListProvider initialPage={initialPage}>
      <section className={styles.wrapper}>
        <Breadcrumbs
          items={[
            {
              label: "Главная",
              href: "/",
            },
            {
              label: "Заявки",
            },
          ]}
        />
        <div className={styles.pageHead}>
          <Title
            text="Актуальные и архивные заявки"
            as="h1"
            className={styles.pageTitle}
          />
          <Subtitle
            text="Просматривайте задачи на платформе. Чтобы откликнуться, войдите или зарегистрируйтесь."
            className={styles.pageSubtitle}
          />
        </div>
        <div className={styles.sortRow}>
          <OrderSort />
        </div>
        <OrderList onOpenOrder={onOpenOrder} />
      </section>
    </OrderListProvider>
  );
}
