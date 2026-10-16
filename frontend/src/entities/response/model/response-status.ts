import type { ResponseItem, ResponseStatusBadge, ResponseViewer } from "./types";

/** Подписывает статус для исполнителя или заказчика и выбирает цвета значка. */
export function getResponseStatusBadge(
  response: ResponseItem,
  viewer: ResponseViewer,
): ResponseStatusBadge {
  const isExpert = viewer === "EXPERT";

  switch (response.status) {
    case "REVIEW":
      return {
        text: "На рассмотрении",
        color: "var(--color-response-status-review-text)",
        background: "var(--color-response-status-review-background)",
      };
    case "REJECTED":
      return {
        text: "Отклонен",
        color: "var(--color-response-status-rejected-text)",
        background: "var(--color-response-status-rejected-background)",
      };
    case "ACCEPTED":
      return {
        text: isExpert
          ? `Приглашение на собеседование от ${response.date}`
          : "В переговорах",
        color: "var(--color-surface)",
        background: "var(--color-orange-primary)",
      };
    case "IN_PROGRESS":
      return {
        text: getInProgressText(response, isExpert),
        color: "var(--color-response-status-progress-text)",
        background: "var(--color-response-status-progress-background)",
      };
    case "COMPLETED":
      return {
        text: "Завершен",
        color: "var(--color-response-status-completed-text)",
        background: "var(--color-response-status-completed-background)",
      };
    case "WITHDRAWN_BY_EXPERT":
      return {
        text: "Отозван исполнителем",
        color: "var(--color-response-status-withdrawn-text)",
        background: "var(--color-response-status-withdrawn-background)",
      };
  }
}

/** Заказчик видит выбранного исполнителя, исполнитель — дату своего согласия. */
function getInProgressText(response: ResponseItem, isExpert: boolean): string {
  if (!isExpert) {
    return "Исполнитель выбран";
  }

  if (response.expert_confirmed) {
    return `Принято ${response.date}`;
  }

  return "Принято";
}
