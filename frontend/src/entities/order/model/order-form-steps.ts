import type { FieldPlace } from "@/shared/lib/step-error";
import { countOrderFormFiles } from "./order-form-files";
import type { OrderFormValues } from "./order-form-types";

/** Шаг формы заказа. Шаг сведений есть, только если у направления свои поля. */
export type OrderFormStep =
  | "work"
  | "main"
  | "details"
  | "experts"
  | "documents"
  | "comment"
  | "preview";

/** Ошибка шага и сам шаг, где её исправить. */
export interface OrderFormProblem {
  step: OrderFormStep;
  message: string;
}

/** Названия шагов; сведения у ЭПБ — это области аттестации исполнителей. */
const STEP_TITLES = {
  work: "Вид работ",
  main: "Основные условия",
  details: "Сведения о заявке",
  experts: "Исполнители",
  documents: "Документы",
  comment: "Комментарий",
  preview: "Проверка",
};

/** Есть ли у заказа шаг сведений: области аттестации у ЭПБ или поля направления. */
function hasDetailsStep(values: OrderFormValues): boolean {
  return values.workType === "EXPERTISE" || values.details !== null;
}

/** Шаги формы по порядку для выбранного вида работ. */
export function getOrderFormSteps(values: OrderFormValues): OrderFormStep[] {
  const steps: OrderFormStep[] = [
    "work",
    "main",
    "details",
    "experts",
    "documents",
    "comment",
    "preview",
  ];

  return hasDetailsStep(values) ? steps : steps.filter((step) => step !== "details");
}

/** Название шага с учётом вида работ. */
export function getOrderStepTitle(step: OrderFormStep, values: OrderFormValues): string {
  if (step === "details" && values.workType === "EXPERTISE") {
    return "Области аттестации";
  }

  return STEP_TITLES[step];
}

/** Что не так на шаге, или пустая строка, если можно идти дальше. */
export function getOrderStepError(step: OrderFormStep, values: OrderFormValues): string {
  switch (step) {
    case "work":
      return values.requiresExpert || values.requiresLicense
        ? ""
        : "Выберите, что требуется: исполнитель и/или лицензия";
    case "main":
      if (!values.title.trim()) {
        return "Укажите название заказа";
      }

      if (!values.startDate) {
        return "Укажите срок начала выполнения работ";
      }

      return values.deadline ? "" : "Укажите срок окончания выполнения работ";
    case "documents":
      return values.workType === "DESIGN" && countOrderFormFiles(values) === 0
        ? "Приложите задание на проектирование"
        : "";
    case "details":
    case "experts":
    case "comment":
    case "preview":
      return "";
  }
}

/** Первая ошибка заказа по шагам, или null, если заказ можно сохранить. */
export function findOrderFormProblem(values: OrderFormValues): OrderFormProblem | null {
  for (const step of getOrderFormSteps(values)) {
    const message = getOrderStepError(step, values);

    if (message) {
      return { step, message };
    }
  }

  return null;
}

/** Где поля заказа в форме: по ним ошибка сервера ведёт на нужный шаг. */
export const ORDER_FORM_FIELD_PLACES: FieldPlace<OrderFormStep>[] = [
  { path: "work_type", step: "work", label: "Вид работ" },
  { path: "requires_expert", step: "work", label: "Требуется исполнитель" },
  { path: "requires_license", step: "work", label: "Требуется лицензия" },
  { path: "title", step: "main", label: "Название заказа" },
  { path: "company", step: "main", label: "Компания" },
  { path: "sum_amount", step: "main", label: "Начальная максимальная цена" },
  { path: "start_date", step: "main", label: "Срок начала выполнения работ" },
  { path: "deadline", step: "main", label: "Срок окончания выполнения работ" },
  { path: "responses_deadline", step: "main", label: "Приём откликов до" },
  { path: "details", step: "details", label: "Сведения о заявке" },
  { path: "details_json", step: "details", label: "Сведения о заявке" },
  { path: "badge_codes_json", step: "details", label: "Области аттестации" },
  { path: "technical_files", step: "documents", label: "Техническое задание" },
  { path: "contract_files", step: "documents", label: "Проект договора" },
  { path: "company_files", step: "documents", label: "Карточка предприятия" },
  { path: "other_files", step: "documents", label: "Иные документы" },
  { path: "copy_documents_json", step: "documents", label: "Документы" },
  { path: "comment", step: "comment", label: "Комментарий к заказу" },
];
