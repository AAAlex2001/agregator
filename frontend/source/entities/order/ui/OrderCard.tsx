import type { ReactNode } from "react";
import { formatMoscowDateTime } from "@/source/shared/lib/formatDate";
import { DiffValue } from "@/source/shared/ui/DiffValue";
import { ListCard } from "@/source/shared/ui/ListCard";
import type { OrderSummary } from "../model/types";
import { OrderOrganizer } from "./OrderOrganizer";
import { RequirementsBadges } from "./RequirementsBadges";

interface OrderCardProps {
  order: OrderSummary;
  onClick?: () => void;
  actions?: ReactNode;
  details?: ReactNode;
  footer?: ReactNode;
}

const ARCHIVED = { text: "Архив", color: "#4d4d4d", bg: "#e6e6e6" };
const OPEN = { text: "Приём заявок", color: "#0b5723", bg: "#b2dfb6" };

/** Карточка заказа в списках: реквизиты, сроки, цена; изменённые заказчиком поля показаны с прежним значением. */
export function OrderCard({ order, onClick, actions, details, footer }: OrderCardProps) {
  const status = order.status === "ARCHIVED" ? ARCHIVED : OPEN;

  return (
    <ListCard
      meta={`№ ${order.id}`}
      statusText={status.text}
      statusColor={status.color}
      statusBg={status.bg}
      titleLabel="Название заказа"
      title={<DiffValue previous={order.previousTitle} current={order.title} />}
      bottomLeftCustom={<OrderOrganizer customer={order.customer} customerInn={order.customerInn} />}
      leftExtra={<RequirementsBadges badges={order.badges} previousBadges={order.previousBadges} workType={order.workType} />}
      rightItems={[
        {
          label: "Начальная максимальная цена",
          value: <DiffValue previous={order.previousSum} current={order.sum || "Не установлена"} />,
          valueAccent: true,
        },
        { label: "Дата публикации", value: order.createdAtDisplay },
        { label: "Приём откликов до (МСК)", value: formatMoscowDateTime(order.responsesDeadline), valueOrange: true },
        { label: "Срок начала выполнения работ", value: order.startDate || "—" },
        { label: "Срок окончания выполнения работ", value: <DiffValue previous={order.previousDeadline} current={order.date || "—"} /> },
      ].filter((item) => item.value)}
      onClick={onClick}
      actions={actions}
      details={details}
      footer={footer}
    />
  );
}
