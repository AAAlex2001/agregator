import type { SelectOption } from "@/shared/ui/select";
import type { DesignOption } from "./types";

/** Превращает справочник проектирования в варианты списка: код — значение, название — подпись. */
export function toDesignSelectOptions(options: DesignOption[]): SelectOption[] {
  return options.map((option) => ({
    value: option.code,
    label: option.title,
  }));
}
