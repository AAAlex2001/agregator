import { BLITZ_STAGE_LABELS, blitzInvoiceUrl, type BlitzOrder } from "@/entities/blitz-order";
import { formatDateTime } from "@/shared/lib/date";
import { formatRub } from "@/shared/lib/money";
import Panel from "@/shared/ui/panel";
import styles from "./style.module.scss";

type OrderInvoicesProps = {
  order: BlitzOrder;
};

/** Состояние счёта для админки. */
const invoiceState = (invoice: BlitzOrder["invoices"][number]) => {
  if (invoice.paid_at) return `оплачен ${formatDateTime(invoice.paid_at)}`;
  if (invoice.canceled_at) return "аннулирован";
  if (invoice.reported_at) return `заказчик сообщил об оплате ${formatDateTime(invoice.reported_at)}`;

  return "ждёт оплаты";
};

/** Счета заявки со ссылками на PDF. Подтверждение оплаты — в разделе «Счета». */
export const OrderInvoices = ({ order }: OrderInvoicesProps) => {
  if (order.invoices.length === 0) return null;

  return (
    <Panel title="Счета">
      <ul className={styles.invoices}>
        {order.invoices.map((invoice) => (
          <li key={invoice.id}>
            <a href={blitzInvoiceUrl(invoice.id)}>Счёт № {invoice.number}</a>
            <span className={styles.meta}>
              {BLITZ_STAGE_LABELS[invoice.stage]} · {formatRub(invoice.amount)} · {invoiceState(invoice)}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
};
