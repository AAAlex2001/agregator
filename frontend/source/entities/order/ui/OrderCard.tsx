import { ListCard } from "@/source/shared/ui/ListCard";
import { DiffValue } from "@/source/shared/ui/DiffValue";
import type { Badge } from "../model/types";
import { RequirementsBadges } from "./RequirementsBadges";

interface Props {
  id?: number | string;
  badges: Badge[];
  title: string;
  customer: string;
  date: string;
  sum: string;
  responsesDeadline?: string | null;
  createdAtDisplay?: string;
  comment?: string;
  technicalFiles?: string[];
  previousTitle?: string | null;
  previousSum?: string | null;
  previousDate?: string | null;
  previousBadges?: Badge[] | null;
  onClick?: () => void;
  children?: React.ReactNode;
  details?: React.ReactNode;
}

function formatResponsesDeadline(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderCard({
  id,
  badges,
  title,
  customer,
  date,
  sum,
  responsesDeadline,
  createdAtDisplay,
  previousTitle,
  previousSum,
  previousDate,
  previousBadges,
  onClick,
  children,
  details,
}: Props) {
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
      label: "Приём откликов до",
      value: responsesDeadline ? formatResponsesDeadline(responsesDeadline) : "—",
    },
    {
      label: "Срок выполнения до",
      value: <DiffValue previous={previousDate ?? null} current={date || "—"} />,
    },
  ];

  const titleNode = previousTitle && previousTitle !== title
    ? <DiffValue previous={previousTitle} current={title} />
    : title;

  return (
    <ListCard
      meta={id !== undefined && id !== "" ? `№ ${id}` : undefined}
      statusText="Приём заявок"
      statusColor="#0b5723"
      statusBg="#b2dfb6"
      titleLabel="Название заказа"
      title={titleNode}
      bottomLeftLabel="Организатор"
      bottomLeftValue={customer || "—"}
      rightItems={rightItems}
      onClick={onClick}
      actions={children}
      details={details}
      leftExtra={<RequirementsBadges badges={badges} previousBadges={previousBadges} />}
    />
  );
}
