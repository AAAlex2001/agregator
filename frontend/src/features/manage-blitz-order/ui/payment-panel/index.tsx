import { BLITZ_STAGE_LABELS } from "@/entities/blitz-order";
import { formatRub } from "@/shared/lib/format-rub";
import type { BlitzStepProps } from "../../model/types";
import { CardPayment } from "../card-payment";
import { InvoicePayment } from "../invoice-payment";
import { StepNote } from "../step-note";

/** Что сейчас оплатить: аванс после договора или остаток за готовое заключение. */
export function PaymentPanel({ order, onChange }: BlitzStepProps) {
  if (!order.stage || order.amount_due === null) {
    return null;
  }

  const isAdvance = order.stage === "advance";
  const title = `${BLITZ_STAGE_LABELS[order.stage]}: ${formatRub(order.amount_due)}`;
  const text = isAdvance
    ? "После оплаты аванса эксперт приступит к работе."
    : "Заключение готово. После оплаты остатка эксперт подпишет его ЭЦП и отправит вам.";

  return (
    <StepNote
      title={title}
      text={text}
    >
      {order.customer_type === "individual" ? (
        <CardPayment
          order={order}
          onChange={onChange}
        />
      ) : (
        <InvoicePayment
          order={order}
          onChange={onChange}
        />
      )}
    </StepNote>
  );
}
