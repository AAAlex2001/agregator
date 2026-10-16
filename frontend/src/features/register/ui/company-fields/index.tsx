import { CompanySuggestInput } from "@/entities/company";
import type { RegistrationCompany } from "../../model/company";

/** Название организации и выбранные из подсказки реквизиты. */
interface CompanyFieldsProps {
  value: RegistrationCompany;
  onChange: (value: RegistrationCompany) => void;
}

/** Выбирает организацию по ИНН или названию для регистрации. */
export function CompanyFields({ value, onChange }: CompanyFieldsProps) {
  return (
    <CompanySuggestInput
      value={value.query}
      onChange={(query, selected) => onChange({ query, selected })}
      placeholder="ИНН или название организации"
    />
  );
}

