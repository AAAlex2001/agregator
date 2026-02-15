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

function parseSumToNumber(sum: string): number {
  const cleaned = sum.replace(/[^\d.,]/g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}

export default function ResponseAnswerCard1({
  order,
  balance,
  onCancel,
  onPay,
  onTopUp,
}: ResponseAnswerCard1Props) {
  const commission = Math.ceil(parseSumToNumber(order.sum) * 0.05);
  const canPay = balance >= commission;

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
        commission={commission}
        balance={balance}
        onTopUp={onTopUp}
      />
      <ActionButtons canPay={canPay} onCancel={onCancel} onPay={onPay} />
    </div>
  );
}
