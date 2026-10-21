"use client";

import { useRouter } from "next/navigation";
import {
  BLITZ_STATUS_LABELS,
  BLITZ_STATUS_TONES,
  OrderDocuments,
  OrderHistory,
  OrderSummary,
} from "@/entities/blitz-order";
import { DangerZone, ExpertForm, PriceForm, StatusForm, useBlitzOrder } from "@/features/blitz-admin";
import { BLITZ_PATH } from "@/shared/lib/admin-paths";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Page from "@/shared/ui/page";
import PageHeader from "@/shared/ui/page-header";
import { OrderInvoices } from "./order-invoices";
import styles from "./style.module.scss";

type BlitzOrderProps = {
  orderId: number;
};

/** Статусы, в которых эксперта ещё можно назначить или заменить. */
const ASSIGNABLE = ["new", "expert_ready"];

/** Статусы, после которых цену уже не меняют. */
const PRICE_LOCKED = ["paid", "sent", "accepted", "canceled"];

/** Карточка заявки: факты, управление статусом, экспертом и ценой, файлы, счета и история. */
const BlitzOrder = ({ orderId }: BlitzOrderProps) => {
  const router = useRouter();
  const { order, error, applyOrder, reload } = useBlitzOrder(orderId);

  if (error) {
    return (
      <div role="alert">
        <Message tone="error">{error}</Message>
        <Button variant="outline" onClick={reload}>Повторить</Button>
      </div>
    );
  }

  if (!order) return <Loader size="lg" />;

  return (
    <Page>
      <PageHeader
        backHref={BLITZ_PATH}
        title={`Заявка №${order.id}`}
        description={order.object_name}
        action={<Badge tone={BLITZ_STATUS_TONES[order.status]}>{BLITZ_STATUS_LABELS[order.status]}</Badge>}
      />

      <div className={styles.layout}>
        <div className={styles.column}>
          <OrderSummary order={order} />
          <OrderInvoices order={order} />
          <OrderDocuments order={order} />
        </div>
        <div className={styles.column}>
          <StatusForm key={`status-${order.status}`} order={order} onChange={applyOrder} />
          {ASSIGNABLE.includes(order.status) && <ExpertForm order={order} onChange={applyOrder} />}
          {!PRICE_LOCKED.includes(order.status) && <PriceForm order={order} onChange={applyOrder} />}
          <OrderHistory order={order} />
          <DangerZone order={order} onChange={applyOrder} onDeleted={() => router.replace(BLITZ_PATH)} />
        </div>
      </div>
    </Page>
  );
};

export default BlitzOrder;
