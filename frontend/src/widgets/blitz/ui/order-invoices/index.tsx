import { BLITZ_STAGE_LABELS, blitzInvoiceUrl } from "@/entities/blitz-order";
import type { BlitzInvoice } from "@/entities/blitz-order";
import { formatDateRu } from "@/shared/lib/format-date";
import { formatRub } from "@/shared/lib/format-rub";
import styles from "./style.module.scss";

/** Счета заявки. */
interface OrderInvoicesProps {
  orderId: number;
  invoices: BlitzInvoice[];
}

/** Состояние счёта для людей. */
function invoiceState(invoice: BlitzInvoice): string {
  if (invoice.paid_at) {
    return `Оплачен ${formatDateRu(invoice.paid_at)}`;
  }

  if (invoice.canceled_at) {
    return "Аннулирован";
  }

  return invoice.reported_at ? "Проверяем оплату" : "Ждёт оплаты";
}

/** Счета: номер, этап, сумма, состояние и PDF. */
export function OrderInvoices({ orderId, invoices }: OrderInvoicesProps) {
  return (
    <ul className={styles.list}>
      {invoices.map((invoice) => (
        <li
          key={invoice.id}
          className={styles.invoice}
        >
          <a
            className={styles.number}
            href={blitzInvoiceUrl(orderId, invoice.id)}
          >
            Счёт № {invoice.number}
          </a>
          <span className={styles.meta}>
            {BLITZ_STAGE_LABELS[invoice.stage]} · {formatRub(invoice.amount)}
            {" · "}
            {invoiceState(invoice)}
          </span>
        </li>
      ))}
    </ul>
  );
}
