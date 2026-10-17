import type { ReactNode } from "react";
import { formatMoscowDateTime } from "@/shared/lib/format-date";
import { ListCard } from "@/shared/ui/list-card";
import type { OrderCardData } from "../../model/order-card-data";
import { OrderOrganizer } from "../order-organizer";
import { OrderRequirements } from "../order-requirements";

/** Сведения заказа и действия, доступные в конкретном списке. */
interface OrderCardProps {
  order: OrderCardData;
  onClick?: () => void;
  actions?: ReactNode;
  details?: ReactNode;
  footer?: ReactNode;
}

/** Оформление архивного заказа. */
const ARCHIVED_STATUS = {
  text: "Архив",
  color: "var(--color-text-label)",
  background: "var(--color-input-border)",
};

/** Оформление заказа, принимающего отклики. */
const OPEN_STATUS = {
  text: "Приём заявок",
  color: "var(--color-order-status-open-text)",
  background: "var(--color-order-status-open-background)",
};

/** Показывает условия заказа. */
export function OrderCard({
  order,
  onClick,
  actions,
  details,
  footer,
}: OrderCardProps) {
  const status = order.status === "ARCHIVED" ? ARCHIVED_STATUS : OPEN_STATUS;

  return (
    <ListCard
      meta={`№ ${order.id}`}
      statusText={status.text}
      statusColor={status.color}
      statusBg={status.background}
      titleLabel="Название заказа"
      title={order.title}
      bottomLeftCustom={
        <OrderOrganizer
          name={order.company || order.customer_name}
          inn={order.customer_inn}
        />
      }
      leftExtra={
        <OrderRequirements
          workType={order.work_type}
          badges={order.badges}
        />
      }
      rightItems={[
        {
          label: "Начальная максимальная цена",
          value: order.sum || "Не установлена",
          valueAccent: true,
        },
        {
          label: "Дата публикации",
          value: order.created_at_display,
        },
        {
          label: "Приём откликов до (МСК)",
          value: formatMoscowDateTime(order.responses_deadline),
          valueOrange: true,
        },
        {
          label: "Срок начала выполнения работ",
          value: order.start_date || "—",
        },
        {
          label: "Срок окончания выполнения работ",
          value: order.date || "—",
        },
      ].filter((item) => item.value)}
      onClick={onClick}
      actions={actions}
      details={details}
      footer={footer}
    />
  );
}
