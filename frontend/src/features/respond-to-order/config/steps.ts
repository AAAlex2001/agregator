import type { OrderListItem } from "@/entities/order";

/** Шаг отклика. Организация нужна, только если заказчику требуется лицензия. */
export type RespondStep = "conditions" | "terms" | "company" | "comment";

/** Названия шагов отклика. */
export const RESPOND_STEP_TITLES = {
  conditions: "Условия отклика",
  terms: "Сроки и стоимость",
  company: "Организация",
  comment: "Комментарий и файлы",
};

/** Шаги отклика на заказ по порядку. */
export function getRespondSteps(order: OrderListItem): RespondStep[] {
  const steps: RespondStep[] = ["conditions", "terms", "company", "comment"];

  return order.requires_license ? steps : steps.filter((step) => step !== "company");
}