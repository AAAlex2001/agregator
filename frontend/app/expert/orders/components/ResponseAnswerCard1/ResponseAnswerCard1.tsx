"use client";

import type { OrderDetails } from "../OrderDetailsModal/types";
import { ActionButtons, CommissionSection, HeaderRow, OrderSummary } from "./sections";
import styles from "./responseAnswerCard1.module.scss";

interface ResponseAnswerCard1Props {
  order: OrderDetails;
  balance: number;
  onCancel: () => void;
  onPay: () => void;
  onTopUp: () => void;
}

export default function ResponseAnswerCard1({
  order,
  balance,
  onCancel,
  onPay,
  onTopUp,
}: ResponseAnswerCard1Props) {
  const canPay = balance >= order.commissionAmountRaw;

  return (
    <div className={styles.card}>
      <HeaderRow />
      <OrderSummary
        title={order.title}
        customer={order.customer}
        date={order.date}
        badges={order.badges}
        sum={order.sum}
      />
      <CommissionSection
        commissionDisplay={order.commissionAmount}
        balance={balance}
        canTopUp={!canPay}
        onTopUp={onTopUp}
      />
      <ActionButtons canPay={canPay} onCancel={onCancel} onPay={onPay} />
    </div>
  );
}
