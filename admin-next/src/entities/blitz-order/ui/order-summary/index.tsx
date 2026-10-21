import { formatDateTime } from "@/shared/lib/date";
import { formatRub } from "@/shared/lib/money";
import Panel from "@/shared/ui/panel";
import {
  BLITZ_CUSTOMER_TYPE_LABELS,
  BLITZ_SERVICE_LABELS,
  BLITZ_STAGE_LABELS,
  blitzPriceLabel,
  type BlitzOrder,
} from "../../model/types";
import styles from "./style.module.scss";

type OrderSummaryProps = {
  order: BlitzOrder;
};

/** Реквизиты организации одной строкой. */
const companyLine = (order: BlitzOrder) =>
  order.company &&
  `${order.company.name}, ИНН ${order.company.inn}, КПП ${order.company.kpp ?? "—"}, ОГРН ${order.company.ogrn}`;

/** Паспортные данные физлица одной строкой. */
const individualLine = (order: BlitzOrder) =>
  order.individual &&
  `${order.individual.full_name}, паспорт ${order.individual.passport_number}, ${order.individual.address}`;

/** Что проверить и срок — только у экспертизы. */
const expertiseRows = (order: BlitzOrder) => [
  ["Область · объект", [order.area_code, order.object_code].filter(Boolean).join(" · ") || "Не указаны"],
  ["Категория эксперта", order.expert_category ? String(order.expert_category) : null],
  ["Срок", order.deadline],
];

/** Факты заявки: сервис, стороны, деньги, что проверить и срок. */
const OrderSummary = ({ order }: OrderSummaryProps) => {
  const due = order.stage && order.amount_due !== null
    ? `${BLITZ_STAGE_LABELS[order.stage]}: ${formatRub(order.amount_due)}`
    : null;
  const rows = [
    ["Сервис", BLITZ_SERVICE_LABELS[order.service]],
    ["Заказчик", `${order.customer_name} · ${BLITZ_CUSTOMER_TYPE_LABELS[order.customer_type]}`],
    ["Реквизиты", companyLine(order) ?? individualLine(order)],
    ["Подписант", order.company && `${order.company.signer_position} ${order.company.signer_name}`],
    ["Исполнитель", order.expert_name ?? "Не назначен"],
    ["Цена", blitzPriceLabel(order.price)],
    ["Оплачено", formatRub(order.paid_amount)],
    ["К оплате сейчас", due],
    ...(order.service === "audit" ? [] : expertiseRows(order)),
    ["Вид договора", order.contract_kind],
    ["Создана", formatDateTime(order.created_at)],
    ["Комментарий", order.comment],
    ["Причина отмены", order.cancel_reason],
  ].filter(([, value]) => value);

  return (
    <Panel title="Заявка">
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

export default OrderSummary;
