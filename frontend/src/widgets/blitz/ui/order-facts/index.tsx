import { BLITZ_CUSTOMER_TYPE_LABELS, BLITZ_DEADLINE_LABELS } from "@/entities/blitz-order";
import type { BlitzOrder } from "@/entities/blitz-order";
import { formatRub } from "@/shared/lib/format-rub";
import styles from "./style.module.scss";

/** Заявка, сведения о которой показываются. */
interface OrderFactsProps {
  order: BlitzOrder;
}

/** Требования к эксперту: класс опасности, категория или ничего. */
function requirement(order: BlitzOrder): string {
  if (order.hazard_class) {
    const category = order.expert_category ?? "—";

    return `${order.hazard_class} класс опасности, категория эксперта ${category}`;
  }

  return order.expert_category ? `${order.expert_category} категория` : "Не указаны";
}

/** Цена, оплата, стороны, коды, срок и комментарий заявки. */
export function OrderFacts({ order }: OrderFactsProps) {
  const facts = [
    { label: "Цена", value: formatRub(order.price) },
    { label: "Оплачено", value: formatRub(order.paid_amount) },
    { label: "Заказчик", value: order.company?.name ?? order.customer_name },
    { label: "Тип заказчика", value: BLITZ_CUSTOMER_TYPE_LABELS[order.customer_type] },
    { label: "Эксперт", value: order.expert_name ?? "Ещё не назначен" },
    { label: "Область аттестации", value: order.area_code ?? "Уточнит эксперт" },
    { label: "Объект экспертизы", value: order.object_code ?? "Уточнит эксперт" },
    { label: "Требования к эксперту", value: requirement(order) },
    { label: "Срок", value: BLITZ_DEADLINE_LABELS[order.deadline] },
  ];

  return (
    <div className={styles.facts}>
      <dl className={styles.list}>
        {facts.map((fact) => (
          <div
            key={fact.label}
            className={styles.row}
          >
            <dt className={styles.label}>{fact.label}</dt>
            <dd className={styles.value}>{fact.value}</dd>
          </div>
        ))}
      </dl>
      {order.comment && <p className={styles.comment}>{order.comment}</p>}
      {order.cancel_reason && (
        <p className={styles.canceled}>Причина отмены: {order.cancel_reason}</p>
      )}
    </div>
  );
}
