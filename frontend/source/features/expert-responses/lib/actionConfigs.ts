import type { ResponseCardData, CardAction } from "@/source/entities/response";

type Loading = "withdraw" | "start" | "complete" | "chat" | null;

interface Handlers {
  onWithdraw: (r: ResponseCardData) => void;
  onEdit: (r: ResponseCardData) => void;
  onShare: (publicId: string) => void;
  onChat: (responseId: number, orderId: number) => void;
  onStart: (id: number) => void;
  onComplete: (id: number) => void;
}

export function getCardActions(card: ResponseCardData, loading: Loading, h: Handlers): CardAction[] {
  const share: CardAction = { text: "Поделиться", variant: "outline", onClick: () => h.onShare(card.orderPublicId) };

  switch (card.rawStatus) {
    case "REVIEW":
      return [
        { text: "Отозвать", variant: "outline", onClick: () => h.onWithdraw(card), isLoading: loading === "withdraw" },
        { text: "Изменить предложение", variant: "secondary", onClick: () => h.onEdit(card) },
        share,
      ];
    case "ACCEPTED":
      return [
        { text: "Отказаться", variant: "outline", onClick: () => h.onWithdraw(card), isLoading: loading === "withdraw" },
        { text: "Чат с заказчиком", variant: "chat", onClick: () => h.onChat(card.id, card.orderId), isLoading: loading === "chat" },
        share,
      ];
    case "IN_PROGRESS":
      if (card.expertConfirmed) {
        return [
          { text: "Чат с заказчиком", variant: "chat", onClick: () => h.onChat(card.id, card.orderId), isLoading: loading === "chat" },
          share,
        ];
      }
      return [
        { text: "Отказаться", variant: "outline", onClick: () => h.onWithdraw(card), isLoading: loading === "withdraw" },
        { text: "Чат с заказчиком", variant: "chat", onClick: () => h.onChat(card.id, card.orderId), isLoading: loading === "chat" },
        { text: "Принять проект", variant: "green", onClick: () => h.onStart(card.id), isLoading: loading === "start" },
        share,
      ];
    case "REJECTED":
    case "COMPLETED":
    default:
      return [share];
  }
}
