import type { BlitzIndividual } from "@/entities/blitz-order";
import { CalendarInput } from "@/shared/ui/calendar-input";
import { Field } from "@/shared/ui/field";
import { TextInput } from "@/shared/ui/text-input";
import { INDIVIDUAL_FIELDS } from "../../config/options";
import type { IndividualField } from "../../model/types";
import styles from "./style.module.scss";

/** Паспортные данные и их изменение. */
interface IndividualFieldsProps {
  individual: BlitzIndividual;
  onChange: (field: IndividualField, value: string) => void;
}

/** Паспорт и адрес для договора и акта. */
export function IndividualFields({ individual, onChange }: IndividualFieldsProps) {
  return (
    <div className={styles.grid}>
      {INDIVIDUAL_FIELDS.map((item) => (
        <Field
          key={item.field}
          label={item.label}
        >
          <TextInput
            value={individual[item.field]}
            placeholder={item.placeholder}
            onChange={(event) => onChange(item.field, event.target.value)}
          />
        </Field>
      ))}
      <Field label="Дата выдачи">
        <CalendarInput
          value={individual.passport_issued_at}
          placeholder="ДД.ММ.ГГГГ"
          onChange={(value) => onChange("passport_issued_at", value)}
        />
      </Field>
    </div>
  );
}
