export type FeedView = "orders" | "archive" | "responses";

export const VIEW_LABEL: Record<FeedView, string> = {
  orders: "Лента заказов",
  archive: "Архивные",
  responses: "Мои отклики",
};
