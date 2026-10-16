import { RadioGroup } from "@/shared/ui/radio-group";
import { TextInput } from "@/shared/ui/text-input";
import { TERM_OPTIONS } from "../../config/options";
import type { LaborListingForm } from "../../model/types";
import styles from "./style.module.scss";

/** Черновик объявления. */
interface TermFieldsProps {
  form: LaborListingForm;
}

/** Показывает регион проживания и срок трудоустройства. */
export function TermFields({ form }: TermFieldsProps) {
  const { fields } = form.state;

  /** Выбирает постоянную работу или срочный договор. */
  function changeTerm(value: string) {
    form.changeTerm(value === "FIXED" ? "FIXED" : "PERMANENT");
  }

  return (
    <>
      <label className={styles.group}>
        <span className={styles.label}>Регион фактического проживания</span>
        <TextInput
          value={form.region}
          onChange={(event) => form.changeField("region", event.target.value)}
          placeholder="Например, Москва"
        />
      </label>

      <div className={styles.group}>
        <RadioGroup
          variant="checklist"
          name="labor-term"
          legend="Срок трудоустройства"
          value={fields.term}
          options={TERM_OPTIONS}
          onChange={changeTerm}
        />

        {fields.term === "FIXED" && (
          <TextInput
            value={fields.fixedTerm}
            onChange={(event) => form.changeField("fixedTerm", event.target.value)}
            placeholder="Укажите срок договора"
          />
        )}
      </div>
    </>
  );
}
