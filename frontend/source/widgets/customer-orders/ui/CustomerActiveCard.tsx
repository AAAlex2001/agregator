import { OrderDetailCard } from "@/source/entities/order";
import type { CardAction } from "@/source/entities/response";
import type { OrderCardData } from "@/source/entities/order";

interface Props {
  card: OrderCardData;
  isDeleting?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function CustomerActiveCard({ card, isDeleting, onEdit, onDelete }: Props) {
  const actions: CardAction[] = [
    { text: "Редактировать", variant: "outline", onClick: onEdit },
    { text: "Удалить", variant: "transparent", onClick: onDelete, isLoading: isDeleting },
  ];

  return (
    <OrderDetailCard
      card={card}
      status={{ text: "Активен", color: "#2e7d32", bg: "#e8f5e9" }}
      actions={actions}
      showQuestions
      expertCanAsk={false}
    />
  );
}
