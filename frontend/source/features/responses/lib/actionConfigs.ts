import type { ResponseCardData, CardAction, UserRole } from "@/source/entities/response";

type Loading = "withdraw" | "start" | "complete" | "chat" | "reject" | "accept" | "select" | null;

interface Handlers {
  onWithdraw?: (r: ResponseCardData) => void;
  onEdit?: (r: ResponseCardData) => void;
  onShare?: (publicId: string) => void;
  onChat?: (rid: number, oid: number) => void;
  onStart?: (id: number) => void;
  onComplete?: (id: number) => void;
  onReject?: (id: number) => void;
  onAccept?: (id: number, orderId: number) => void;
  onSelect?: (id: number) => void;
  onLeaveReview?: (r: ResponseCardData) => void;
}

export function getCardActions(card: ResponseCardData, loading: Loading, role: UserRole, h: Handlers): CardAction[] {
  return role === "customer" ? customerActions(card, loading, h) : expertActions(card, loading, h);
}

function expertActions(card: ResponseCardData, loading: Loading, h: Handlers): CardAction[] {
  const share: CardAction = { text: "Поделиться", variant: "outline", onClick: () => h.onShare?.(card.orderPublicId) };

  switch (card.rawStatus) {
    case "REVIEW":
      return [
        { text: "Отозвать", variant: "outline", onClick: () => h.onWithdraw?.(card), isLoading: loading === "withdraw" },
        { text: "Изменить предложение", variant: "secondary", onClick: () => h.onEdit?.(card) },
        share,
      ];
    case "ACCEPTED":
      return [
        { text: "Отказаться", variant: "outline", onClick: () => h.onWithdraw?.(card), isLoading: loading === "withdraw" },
        { text: "Чат с заказчиком", variant: "secondary", onClick: () => h.onChat?.(card.id, card.orderId), isLoading: loading === "chat" },
        share,
      ];
    case "IN_PROGRESS":
      if (card.expertConfirmed) {
        return [
          { text: "Чат с заказчиком", variant: "secondary", onClick: () => h.onChat?.(card.id, card.orderId), isLoading: loading === "chat" },
          share,
        ];
      }
      return [
        { text: "Отказаться", variant: "outline", onClick: () => h.onWithdraw?.(card), isLoading: loading === "withdraw" },
        { text: "Чат с заказчиком", variant: "secondary", onClick: () => h.onChat?.(card.id, card.orderId), isLoading: loading === "chat" },
        { text: "Принять проект", variant: "green", onClick: () => h.onStart?.(card.id), isLoading: loading === "start" },
        share,
      ];
    default:
      return [share];
  }
}

function customerActions(card: ResponseCardData, loading: Loading, h: Handlers): CardAction[] {
  switch (card.rawStatus) {
    case "REVIEW":
      return [
        { text: "Отклонить", variant: "transparent", onClick: () => h.onReject?.(card.id), isLoading: loading === "reject" },
        { text: "Пригласить в чат", variant: "secondary", onClick: () => h.onAccept?.(card.id, card.orderId), isLoading: loading === "accept" },
      ];
    case "ACCEPTED":
      return [
        { text: "Отклонить", variant: "transparent", onClick: () => h.onReject?.(card.id), isLoading: loading === "reject" },
        { text: "Выбрать исполнителем", variant: "outline", onClick: () => h.onSelect?.(card.id), isLoading: loading === "select" },
        { text: "Перейти в чат", variant: "secondary", onClick: () => h.onChat?.(card.id, card.orderId), isLoading: loading === "chat" },
      ];
    case "IN_PROGRESS":
      return [
        { text: "Отклонить", variant: "transparent", onClick: () => h.onReject?.(card.id), isLoading: loading === "reject" },
        { text: "Чат с экспертом", variant: "secondary", onClick: () => h.onChat?.(card.id, card.orderId), isLoading: loading === "chat" },
        { text: "Завершить проект", variant: "green", onClick: () => h.onComplete?.(card.id), isLoading: loading === "complete" },
      ];
    case "COMPLETED":
      return card.hasReview ? [] : [
        { text: "Оставить отзыв", variant: "secondary", onClick: () => h.onLeaveReview?.(card) },
      ];
    default:
      return [];
  }
}
