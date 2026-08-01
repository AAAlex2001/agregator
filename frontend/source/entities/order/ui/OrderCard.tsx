import { ListCard } from "@/source/shared/ui/ListCard";
import { DiffValue } from "@/source/shared/ui/DiffValue";
import type { Badge } from "../model/types";
import type { OrderWorkType } from "../model/workTypes";
import { RequirementsBadges } from "./RequirementsBadges";
import { OrderOrganizer } from "./OrderOrganizer";
import { formatMoscowDateTime } from "@/source/shared/lib/formatDate";

interface Props {
  id?: number | string;
  badges: Badge[];
  title: string;
  customer: string;
  customerInn?: string;
  startDate?: string;
  date: string;
  sum: string;
  responsesDeadline?: string | null;
  createdAtDisplay?: string;
  comment?: string;
  status?: string;
  previousTitle?: string | null;
  previousSum?: string | null;
  previousDate?: string | null;
  previousBadges?: Badge[] | null;
  workType?: OrderWorkType;
  onClick?: () => void;
  children?: React.ReactNode;
  details?: React.ReactNode;
}

function resolveStatusBadge(status?: string): { text: string; color: string; bg: string } {
  if (status === "ARCHIVED") {
    return { text: "Архив", color: "#4d4d4d", bg: "#e6e6e6" };
  }
  return { text: "Приём заявок", color: "#0b5723", bg: "#b2dfb6" };
}

export function OrderCard({
  id,
  badges,
  title,
  customer,
  customerInn,
  startDate,
  date,
  sum,
  responsesDeadline,
  createdAtDisplay,
  status,
  previousTitle,
  previousSum,
  previousDate,
  previousBadges,
  workType,
  onClick,
  children,
  details,
}: Props) {
  const statusBadge = resolveStatusBadge(status);
  const rightItems = [
    {
      label: "Начальная максимальная цена",
      value: <DiffValue previous={previousSum ?? null} current={sum || "Не установлена"} />,
      valueAccent: true,
    },
    ...(createdAtDisplay
      ? [{ label: "Дата публикации", value: createdAtDisplay }]
      : []),
    {
      label: "Приём откликов до (МСК)",
      value: formatMoscowDateTime(responsesDeadline),
      valueOrange: true,
    },
    {
      label: "Срок начала выполнения работ",
      value: startDate || "—",
    },
    {
      label: "Срок окончания выполнения работ",
      value: <DiffValue previous={previousDate ?? null} current={date || "—"} />,
    },
  ];

  const titleNode = previousTitle && previousTitle !== title
    ? <DiffValue previous={previousTitle} current={title} />
    : title;

  return (
    <ListCard
      meta={id !== undefined && id !== "" ? `№ ${id}` : undefined}
      statusText={statusBadge.text}
      statusColor={statusBadge.color}
      statusBg={statusBadge.bg}
      titleLabel="Название заказа"
      title={titleNode}
      bottomLeftCustom={<OrderOrganizer customer={customer} customerInn={customerInn} />}
      rightItems={rightItems}
      onClick={onClick}
      actions={children}
      details={details}
      leftExtra={<RequirementsBadges badges={badges} previousBadges={previousBadges} workType={workType} />}
    />
  );
}
