"use client";

import { ListCard } from "@/source/shared/ui/ListCard";
import { ActionButtons } from "@/source/entities/response";
import type { CardAction } from "@/source/entities/response";

export interface DraftCardField {
  label: string;
  value: string;
  accent?: boolean;
  orange?: boolean;
}

interface Props {
  meta: string;
  title: string;
  titleLabel?: string;
  bottomLeftLabel?: string;
  bottomLeftValue?: string;
  rightItems?: DraftCardField[];
  onContinue: () => void;
  onDelete: () => void;
}

export function DraftCard({
  meta,
  title,
  titleLabel = "Название заказа:",
  bottomLeftLabel,
  bottomLeftValue,
  rightItems = [],
  onContinue,
  onDelete,
}: Props) {
  const actions: CardAction[] = [
    { text: "Продолжить", variant: "secondary", onClick: onContinue },
    { text: "Удалить", variant: "transparent", onClick: onDelete },
  ];

  return (
    <ListCard
      meta={meta}
      statusText="Черновик"
      statusColor="#5d4037"
      statusBg="#efebe9"
      titleLabel={titleLabel}
      title={title || "—"}
      bottomLeftLabel={bottomLeftLabel}
      bottomLeftValue={bottomLeftValue || "—"}
      rightItems={rightItems.map((item) => ({
        label: item.label,
        value: item.value,
        valueAccent: item.accent,
        valueOrange: item.orange,
      }))}
      actions={<ActionButtons actions={actions} />}
    />
  );
}
