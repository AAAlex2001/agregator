/** Шаг изменения предложения. */
export type EditResponseStep = "terms" | "comment";

/** Шаги изменения предложения по порядку. */
export const EDIT_RESPONSE_STEPS: { key: EditResponseStep; title: string }[] = [
  { key: "terms", title: "Сроки и стоимость" },
  { key: "comment", title: "Комментарий и файлы" },
];