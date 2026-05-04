import { OrderDetailCard } from "@/source/entities/order";
import type { CardAction } from "@/source/entities/response";
import type { OrderCardData } from "@/source/entities/order";

interface Props {
  card: OrderCardData;
  canLeaveReview?: boolean;
  onLeaveReview?: () => void;
}

export function ArchivedCard({ card, canLeaveReview, onLeaveReview }: Props) {
  const actions: CardAction[] = canLeaveReview && onLeaveReview
    ? [{ text: "Оставить отзыв", variant: "primary", onClick: onLeaveReview }]
    : [];

  return (
    <OrderDetailCard
      card={card}
      status={{ text: "Архив", color: "#ff8a00", bg: "#fff8eb" }}
      actions={actions}
      showExecutor
      showQuestions
      expertCanAsk={false}
    />
  );
}
