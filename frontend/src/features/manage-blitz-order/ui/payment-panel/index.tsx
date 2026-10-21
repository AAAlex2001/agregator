import { BLITZ_STAGE_LABELS, blitzWording } from "@/entities/blitz-order";
import { formatRub } from "@/shared/lib/format-rub";
import type { BlitzStepProps } from "../../model/types";
import { CardPayment } from "../card-payment";
import { InvoicePayment } from "../invoice-payment";
import { StepNote } from "../step-note";

/** Что сейчас оплатить: аванс после договора или остаток за готовый результат. */
export function PaymentPanel({ order, onChange }: BlitzStepProps) {
  if (!order.stage || order.amount_due === null) {
    return null;
  }

  const wording = blitzWording(order.service);
  const title = `${BLITZ_STAGE_LABELS[order.stage]}: ${formatRub(order.amount_due)}`;
  const text = order.stage === "advance"
    ? wording.afterAdvance
    : `${wording.resultReady}. После оплаты остатка ${wording.executor.toLowerCase()} `
      + "подпишет его ЭЦП и отправит вам.";

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
