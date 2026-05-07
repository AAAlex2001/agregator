import type { ResponseCardData, CardAction, UserRole } from "@/source/entities/response";

type Loading = "withdraw" | "start" | "complete" | "chat" | "reject" | "accept" | "select" | "restore" | null;

interface Handlers {
  onWithdraw?: (r: ResponseCardData) => void;
  onEdit?: (r: ResponseCardData) => void;
  onShare?: (publicId: string) => void;
  onChat?: (rid: number, oid: number) => void;
  onStart?: (id: number) => void;
  onComplete?: (id: number) => void;
  onReject?: (r: ResponseCardData) => void;
  onAccept?: (id: number, orderId: number) => void;
  onSelect?: (id: number) => void;
  onRestore?: (id: number) => void;
  onLeaveReview?: (r: ResponseCardData) => void;
  /** Можно ли вернуть отклонённый отклик в рассмотрение (false если у заказа уже выбран исполнитель). */
  canRestore?: (r: ResponseCardData) => boolean;
}

export function getCardActions(card: ResponseCardData, loading: Loading, role: UserRole, h: Handlers): CardAction[] {
  return role === "customer" ? customerActions(card, loading, h) : expertActions(card, loading, h);
}

function expertActions(card: ResponseCardData, loading: Loading, h: Handlers): CardAction[] {
  const share: CardAction = { text: "Поделиться", variant: "outline", onClick: () => h.onShare?.(card.orderPublicId) };
  const withdraw = (text: string): CardAction => ({
    text,
    variant: "transparent",
    onClick: () => h.onWithdraw?.(card),
    isLoading: loading === "withdraw",
  });

  switch (card.rawStatus) {
    case "REVIEW":
      return [
        { text: "Изменить предложение", variant: "secondary", onClick: () => h.onEdit?.(card) },
        share,
        withdraw("Отозвать"),
      ];
    case "ACCEPTED":
      return [
        { text: "Чат с заказчиком", variant: "secondary", onClick: () => h.onChat?.(card.id, card.orderId), isLoading: loading === "chat" },
        share,
        withdraw("Отказаться"),
      ];
    case "IN_PROGRESS":
      if (card.expertConfirmed) {
        return [
          { text: "Чат с заказчиком", variant: "secondary", onClick: () => h.onChat?.(card.id, card.orderId), isLoading: loading === "chat" },
          share,
        ];
      }
      return [
        { text: "Чат с заказчиком", variant: "secondary", onClick: () => h.onChat?.(card.id, card.orderId), isLoading: loading === "chat" },
        { text: "Принять проект", variant: "green", onClick: () => h.onStart?.(card.id), isLoading: loading === "start" },
        share,
        withdraw("Отказаться"),
      ];
    default:
      return [share];
  }
}

function customerActions(card: ResponseCardData, loading: Loading, h: Handlers): CardAction[] {
  const reject: CardAction = {
    text: "Отклонить",
    variant: "transparent",
    onClick: () => h.onReject?.(card),
    isLoading: loading === "reject",
  };

  switch (card.rawStatus) {
    case "REVIEW":
      return [
        { text: "Пригласить в чат", variant: "secondary", onClick: () => h.onAccept?.(card.id, card.orderId), isLoading: loading === "accept" },
        { text: "Выбрать исполнителем", variant: "green", onClick: () => h.onSelect?.(card.id), isLoading: loading === "select" },
        reject,
      ];
    case "ACCEPTED":
      return [
        { text: "Выбрать исполнителем", variant: "green", onClick: () => h.onSelect?.(card.id), isLoading: loading === "select" },
        { text: "Перейти в чат", variant: "secondary", onClick: () => h.onChat?.(card.id, card.orderId), isLoading: loading === "chat" },
        reject,
      ];
    case "IN_PROGRESS":
      return [
        { text: "Чат с экспертом", variant: "secondary", onClick: () => h.onChat?.(card.id, card.orderId), isLoading: loading === "chat" },
        { text: "Завершить проект", variant: "green", onClick: () => h.onComplete?.(card.id), isLoading: loading === "complete" },
        reject,
      ];
    case "REJECTED":
      if (h.canRestore && !h.canRestore(card)) return [];
      return [
        { text: "Вернуть на рассмотрение", variant: "outline", onClick: () => h.onRestore?.(card.id), isLoading: loading === "restore" },
      ];
    case "COMPLETED":
      return card.hasReview ? [] : [
        { text: "Оставить отзыв", variant: "secondary", onClick: () => h.onLeaveReview?.(card) },
      ];
    default:
      return [];
  }
}
