import { blitzCompanyProblem, parseBlitzPrice } from "@/entities/blitz-order";
import { INDIVIDUAL_FIELDS } from "../config/options";
import { ORDER_STEPS } from "../config/steps";
import type { OrderStep } from "../config/steps";
import type { CreateBlitzOrderState } from "./types";

/** Ошибка шага и номер шага, где её исправить. */
export interface OrderStepProblem {
  step: number;
  problem: string;
}

/** Что не так с предметом экспертизы, или null. */
function subjectProblem(state: CreateBlitzOrderState): string | null {
  if (state.objectName.trim().length < 3) {
    return "Укажите наименование документации";
  }

  if (state.requirement === "class" && !state.hazardClass) {
    return "Выберите класс опасности";
  }

  if (state.requirement === "category" && !state.category) {
    return "Выберите категорию эксперта";
  }

  return null;
}

/** Что не так с паспортными данными физлица, или null. */
function individualProblem(state: CreateBlitzOrderState): string | null {
  const missing = INDIVIDUAL_FIELDS.find((item) => !state.individual[item.field].trim());

  if (missing) {
    return `Заполните поле «${missing.label}»`;
  }

  return state.individual.passport_issued_at ? null : "Укажите дату выдачи паспорта";
}

/** Что не так на шаге, или null, если можно идти дальше. */
export function orderStepProblem(
  step: OrderStep,
  state: CreateBlitzOrderState,
  filesCount: number,
): string | null {
  switch (step) {
    case "subject":
      return subjectProblem(state);
    case "price":
      return parseBlitzPrice(state.price) > 0 ? null : "Укажите цену за экспертизу";
    case "documents":
      return filesCount > 0 ? null : "Приложите документацию";
    case "customer":
      return state.customerType === "individual"
        ? individualProblem(state)
        : blitzCompanyProblem(state.company);
    case "comment":
      return null;
  }
}

/** Первый шаг с ошибкой перед отправкой, или null. */
export function firstOrderProblem(
  state: CreateBlitzOrderState,
  filesCount: number,
): OrderStepProblem | null {
  for (const [step, item] of ORDER_STEPS.entries()) {
    const problem = orderStepProblem(item.key, state, filesCount);

    if (problem) {
      return { step, problem };
    }
  }

  return null;
}