import { ListCard } from "@/source/shared/ui/ListCard";
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
  onClick,
  children,
  details,
}: Props) {
  const rightItems = [
    { label: "Начальная максимальная цена", value: sum || "Не установлена", valueAccent: true },
    ...(createdAtDisplay
      ? [{ label: "Дата публикации", value: createdAtDisplay }]
      : []),
    {
      label: "Приём откликов до",
      value: responsesDeadline ? formatResponsesDeadline(responsesDeadline) : "—",
    },
    { label: "Срок выполнения до", value: date || "—" },
  ];

  return (
    <ListCard
      meta={id !== undefined && id !== "" ? `№ ${id}` : undefined}
      statusText="Приём заявок"
      statusColor="#0b5723"
      statusBg="#b2dfb6"
      titleLabel="Название заказа"
      title={title}
      bottomLeftLabel="Организатор"
      bottomLeftValue={customer || "—"}
      rightItems={rightItems}
      onClick={onClick}
      actions={children}
      details={details}
      leftExtra={<RequirementsBadges badges={badges} />}
    />
  );
}
