import type { LaboratoryProfileValues } from "./types";

/** Создаёт пустые поля лаборатории для регистрации. */
export function createLaboratoryProfileValues(): LaboratoryProfileValues {
  return {
    accreditation_area: "",
    comment: "",
  };
}
