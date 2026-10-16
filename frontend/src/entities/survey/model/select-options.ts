import type { SelectOption } from "@/shared/ui/select";
import type { SurveyKind } from "./types";

/** Превращает виды изысканий в варианты списка с сокращением перед названием. */
export function toSurveyKindSelectOptions(kinds: SurveyKind[]): SelectOption[] {
  return kinds.map((kind) => ({
    value: kind.code,
    label: `${kind.short} — ${kind.title}`,
  }));
}
