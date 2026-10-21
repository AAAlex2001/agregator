import { parseBlitzPrice } from "@/entities/blitz-order";
import type { BlitzOrderPayload } from "@/entities/blitz-order";
import type { CreateBlitzOrderState } from "./types";

/** Число из поля или null, если поле пустое. */
function numberOrNull(value: string): number | null {
  return value ? Number(value) : null;
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
    price: parseBlitzPrice(state.price),
    customer_type: state.customerType,
    company: isIndividual ? null : { ...state.company, kpp: state.company.kpp || null },
    individual: isIndividual ? state.individual : null,
    comment: state.comment.trim() || null,
  };
}
