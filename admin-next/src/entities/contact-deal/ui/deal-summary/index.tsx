import { formatDateTime } from "@/shared/lib/date";
import { formatRub } from "@/shared/lib/money";
import Panel from "@/shared/ui/panel";
import { RELEASE_ACTOR_LABELS, type Deal } from "../../model/types";
import styles from "./style.module.scss";

type DealSummaryProps = {
  deal: Deal;
};

/** Главные факты сделки: стороны, сумма, хэш договора и ключевые даты. */
const DealSummary = ({ deal }: DealSummaryProps) => {
  const rows = [
    ["Исполнитель", deal.seller_name],
    ["Покупатель", deal.buyer_name],
    ["Сумма", formatRub(deal.price_rubles)],
    ["Создана", formatDateTime(deal.created_at)],
    ["Оплата заявлена", formatDateTime(deal.buyer_reported_paid_at)],
    ["Оплата подтверждена исполнителем", formatDateTime(deal.seller_confirmed_at)],
    ["Контакты выданы", deal.released_at && `${formatDateTime(deal.released_at)} ${deal.released_by ? RELEASE_ACTOR_LABELS[deal.released_by] : ""}`],
    ["Реквизиты для оплаты", deal.payment_details],
    ["SHA-256 договора", deal.contract_hash],
  ].filter(([, value]) => value);

  return (
    <Panel title="Сделка">
      <dl className={styles.grid}>
        {rows.map(([label, value]) => (
          <div key={label} className={styles.item}>
            <dt className={styles.label}>{label}</dt>
            <dd className={styles.value}>{value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
};

export default DealSummary;
