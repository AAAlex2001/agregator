import type { SelectOption } from "@/shared/ui/select";
import type { EcologyWorkType } from "./types";

/** Превращает виды экологических работ в варианты списка: код — значение, название — подпись. */
export function toEcologySelectOptions(workTypes: EcologyWorkType[]): SelectOption[] {
  return workTypes.map((workType) => ({
    value: workType.code,
    label: workType.title,
  }));
}
