"use client";

import {
  BlitzDocuments,
  BlitzHistory,
  BlitzProgress,
  BlitzStatusBadge,
  useBlitzOrder,
} from "@/entities/blitz-order";
import { useUser } from "@/entities/user";
import { BlitzOrderActions } from "@/features/manage-blitz-order";
import { formatRub } from "@/shared/lib/format-rub";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import { OrderFacts } from "../order-facts";
import { OrderInvoices } from "../order-invoices";
import { OrderPanel } from "../order-panel";
import { PriceHistory } from "../price-history";
import { RemarksThread } from "../remarks-thread";
import styles from "./style.module.scss";

/** Номер заявки и вернулся ли заказчик со страницы оплаты. */
interface BlitzOrderViewProps {
  orderId: number;
  afterPayment: boolean;
}

/** Страница заявки: статус, прогресс, что сделать сейчас, замечания, файлы, счета и история. */
export function BlitzOrderView({ orderId, afterPayment }: BlitzOrderViewProps) {
  const { order, error, isLoading, applyOrder } = useBlitzOrder(orderId, afterPayment);
  const { user } = useUser();
  const isExpert = user?.role === "EXPERT";

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Loader />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.page}>
        <EmptyState
          title="Заявка не найдена"
          subtitle={error ?? "Возможно, её отменили или она вам недоступна"}
          actionLabel="Ко всем заявкам"
          actionHref="/blitz"
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className={styles.titleRow}>
          <span className={styles.number}>Заявка №{order.id}</span>
          <BlitzStatusBadge
            status={order.status}
            isExpert={isExpert}
          />
        </div>
        <h1 className={styles.title}>{order.object_name}</h1>
        <span className={styles.price}>{formatRub(order.price)}</span>
        <BlitzProgress status={order.status} />
      </header>

      <div className={styles.layout}>
        <div className={styles.main}>
          <BlitzOrderActions
            order={order}
            isExpert={isExpert}
            onChange={applyOrder}
          />
          {order.remarks.length > 0 && (
            <OrderPanel title="Замечания">
              <RemarksThread
                orderId={order.id}
                remarks={order.remarks}
              />
            </OrderPanel>
          )}
          <OrderPanel title="Файлы">
            <BlitzDocuments
              orderId={order.id}
              documents={order.documents.filter((document) => document.remark_id === null)}
            />
          </OrderPanel>
          {order.invoices.length > 0 && (
            <OrderPanel title="Счета">
              <OrderInvoices
                orderId={order.id}
                invoices={order.invoices}
              />
            </OrderPanel>
          )}
        </div>

        <aside className={styles.aside}>
          <OrderPanel title="Сведения">
            <OrderFacts order={order} />
          </OrderPanel>
          {order.price_changes.length > 0 && (
            <OrderPanel title="Изменения цены">
              <PriceHistory order={order} />
            </OrderPanel>
          )}
          <OrderPanel title="История">
            <BlitzHistory
              history={order.history}
              isExpert={isExpert}
            />
          </OrderPanel>
        </aside>
      </div>
    </div>
  );
}
