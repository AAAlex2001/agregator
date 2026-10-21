"use client";

import { CATALOG_PAGE_SIZE, OrderListProvider, type OrderListPage } from "@/entities/order";
import { OrderSort } from "@/features/sort-orders";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { OrderList } from "../order-list";
import styles from "./style.module.scss";

/** Серверная страница заказов, её номер и переход после выбора карточки. */
interface PublicOrdersProps {
  initialPage: OrderListPage;
  page: number;
  onOpenOrder: (orderId: number) => void;
}

/** Собирает публичный список, сортировку и пояснение для посетителя. */
export function PublicOrders({ initialPage, page, onOpenOrder }: PublicOrdersProps) {
  return (
    <OrderListProvider
      initialPage={initialPage}
      initialOffset={(page - 1) * CATALOG_PAGE_SIZE}
      pageSize={CATALOG_PAGE_SIZE}
    >
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
