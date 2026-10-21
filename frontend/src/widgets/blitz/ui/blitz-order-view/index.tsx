"use client";

import {
  BlitzDocuments,
  BlitzHistory,
  BlitzProgress,
  BlitzStatusBadge,
  blitzPriceLabel,
  useBlitzOrder,
} from "@/entities/blitz-order";
import { useUser } from "@/entities/user";
import { BlitzOrderActions } from "@/features/manage-blitz-order";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import { AuditDetails } from "../audit-details";
import { AuditPlan } from "../audit-plan";
import { AuditTeam } from "../audit-team";
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

/** Страница заявки: статус, прогресс, что сделать сейчас, анкета аудита, файлы, счета и история. */
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
          <span className={styles.number}>
            {order.service === "audit" ? "Аудит СУПБ" : "Заявка"} №{order.id}
          </span>
          <BlitzStatusBadge
            status={order.status}
            service={order.service}
            isExpert={isExpert}
          />
        </div>
        <h1 className={styles.title}>{order.object_name}</h1>
        <span className={styles.price}>{blitzPriceLabel(order.price)}</span>
        <BlitzProgress
          status={order.status}
          service={order.service}
        />
      </header>

      <div className={styles.layout}>
        <div className={styles.main}>
          <BlitzOrderActions
            order={order}
            isExpert={isExpert}
            viewerId={user?.id}
            onChange={applyOrder}
          />
          {order.audit_plan && (
            <OrderPanel title="План аудита">
              <AuditPlan plan={order.audit_plan} />
            </OrderPanel>
          )}
          {order.remarks.length > 0 && (
            <OrderPanel title="Замечания">
              <RemarksThread
                orderId={order.id}
                remarks={order.remarks}
              />
            </OrderPanel>
          )}
          {order.audit_details && (
            <OrderPanel title="Анкета аудита">
              <AuditDetails details={order.audit_details} />
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
          {order.team.length > 0 && (
            <OrderPanel title="Аудиторская группа">
              <AuditTeam team={order.team} />
            </OrderPanel>
          )}
          {order.price_changes.length > 0 && (
            <OrderPanel title="Изменения цены">
              <PriceHistory order={order} />
            </OrderPanel>
          )}
          <OrderPanel title="История">
            <BlitzHistory
              history={order.history}
              service={order.service}
              isExpert={isExpert}
            />
          </OrderPanel>
        </aside>
      </div>
    </div>
  );
}
