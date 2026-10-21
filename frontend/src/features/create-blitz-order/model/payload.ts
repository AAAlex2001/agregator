import type { BlitzOrderPayload } from "@/entities/blitz-order";
import type { CreateBlitzOrderState } from "./types";

/** Число из поля или null, если поле пустое. */
function numberOrNull(value: string): number | null {
  return value ? Number(value) : null;
}

/** Цена из поля: пробелы между разрядами и запятая допустимы. */
export function parsePrice(value: string): number {
  return Number(value.replace(/\s/g, "").replace(",", "."));
}

/** Что ещё не заполнено, или null, если заявку можно отправить. */
export function blitzOrderProblem(state: CreateBlitzOrderState, filesCount: number): string | null {
  if (state.objectName.trim().length < 3) {
    return "Укажите наименование документации";
  }

  if (!(parsePrice(state.price) > 0)) {
    return "Укажите цену за экспертизу";
  }

  if (filesCount === 0) {
    return "Приложите документацию";
  }

  return null;
}

/** Данные заявки для API. */
export function toBlitzOrderPayload(state: CreateBlitzOrderState): BlitzOrderPayload {
  const isIndividual = state.customerType === "individual";

  return {
    object_code: state.objectCode || null,
    area_code: state.areaCode || null,
    hazard_class: state.requirement === "class" ? numberOrNull(state.hazardClass) : null,
    expert_category: state.requirement === "category" ? numberOrNull(state.category) : null,
    deadline: state.deadline,
    object_name: state.objectName.trim(),
    contract_kind: state.contractKind || null,
    price: parsePrice(state.price),
    customer_type: state.customerType,
    company: isIndividual ? null : { ...state.company, kpp: state.company.kpp || null },
    individual: isIndividual ? state.individual : null,
    comment: state.comment.trim() || null,
  };
}
