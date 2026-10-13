import type { EmploymentTerm } from "@/source/entities/labor";
import {
  RadioGroup,
  TextInput,
} from "@/source/shared/ui";
import type { LaborPageMode } from "../model/types";
import s from "./LaborForm.module.scss";

interface EmploymentTermFieldsProps {
  mode: LaborPageMode;
  term: EmploymentTerm;
  fixedTerm: string;
  onTermChange: (value: EmploymentTerm) => void;
  onFixedTermChange: (value: string) => void;
}

export function EmploymentTermFields({
  mode,
  term,
  fixedTerm,
  onTermChange,
  onFixedTermChange,
}: EmploymentTermFieldsProps) {
  return (
    <div className={s.fieldGroup}>
      <RadioGroup
        variant="checklist"
        name={`${mode}-term`}
        value={term}
        onChange={onTermChange}
        legend="Срок трудоустройства"
        options={[
          {
            value: "PERMANENT",
            label: "На постоянной основе",
          },
          {
            value: "FIXED",
            label: "Срочный трудовой договор",
          },
        ]}
      />

      {term === "FIXED" && (
        <TextInput
          value={fixedTerm}
          onChange={(event) =>
            onFixedTermChange(event.target.value)
          }
          placeholder="Укажите срок договора"
        />
      )}
    </div>
  );
}
