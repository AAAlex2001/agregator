import type { SelectOption } from "@/shared/ui/select";
import type { ResearchOption } from "./types";

/** Превращает научный справочник в варианты выбора: код — значение, название — подпись. */
export function toResearchSelectOptions(options: ResearchOption[]): SelectOption[] {
  return options.map((option) => ({
    value: option.code,
    label: option.title,
  }));
}
