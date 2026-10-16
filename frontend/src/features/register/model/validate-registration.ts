import { getExpertDirections } from "./expert-directions";
import type { RegisterState } from "./types";

/** Проверяет наличие направления и подтверждённой организации перед отправкой. */
export function validateRegistration(state: RegisterState): string | null {
  let hasDirection: boolean;

  if (state.role === "CUSTOMER") {
    hasDirection = state.customer.directions.length > 0 || state.customer.audit !== null;
  } else if (state.role === "EXPERT") {
    hasDirection = getExpertDirections(state.expert).length > 0;
  } else {
    const holder = state.holder;
    hasDirection = holder.license.enabled
      || holder.directions.length > 0
      || holder.audit !== null
      || holder.techDiag !== null
      || holder.design !== null
      || holder.survey !== null;
  }

  if (!hasDirection) {
    return "Выберите хотя бы одно направление";
  }

  if (state.role !== "EXPERT" && !state.company.selected) {
    return "Выберите организацию из подсказок по ИНН";
  }

  return null;
}

