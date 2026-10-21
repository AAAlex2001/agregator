import { CompanySuggestInput } from "@/entities/company";
import type { CompanySuggestion } from "@/entities/company";
import { Field } from "@/shared/ui/field";
import type { CompanyChoice } from "../../model/types";

/** Выбранная организация и её смена. */
interface CompanyStepProps {
  choice: CompanyChoice;
  onChange: (query: string, company: CompanySuggestion | null) => void;
}

/** Организация, от которой подаётся отклик: нужна, если заказчику требуется лицензия. */
export function CompanyStep({ choice, onChange }: CompanyStepProps) {
  return (
    <Field
      label="Организация, от которой подаёте заявку"
      hint="С ней заказчик заключит договор: выберите её из списка по ИНН или названию"
    >
      <CompanySuggestInput
        value={choice.name}
        placeholder="ИНН или название компании"
        onChange={onChange}
      />
    </Field>
  );
}