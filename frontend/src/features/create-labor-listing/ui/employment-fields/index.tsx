import { CalendarInput } from "@/shared/ui/calendar-input";
import { RadioGroup } from "@/shared/ui/radio-group";
import { EMPLOYMENT_TYPE_OPTIONS, JOB_STATUS_OPTIONS } from "../../config/options";
import type { LaborListingForm } from "../../model/types";
import styles from "./style.module.scss";

/** Вид объявления и его черновик. */
interface EmploymentFieldsProps {
  isExpert: boolean;
  form: LaborListingForm;
}

/** Исполнитель указывает текущую работу, организация — дату выхода и вид занятости. */
export function EmploymentFields({ isExpert, form }: EmploymentFieldsProps) {
  const { fields } = form.state;

  /** Сохраняет текущее основное место работы исполнителя. */
  function changeJobStatus(value: string) {
    form.changeJobStatus(value === "EMPLOYED" ? "EMPLOYED" : "NONE");
  }

  /** Выбирает основное место работы или совместительство. */
  function changeEmploymentType(value: string) {
    form.changeEmploymentType(value === "PART_TIME" ? "PART_TIME" : "PRIMARY");
  }

  if (isExpert) {
    return (
      <RadioGroup
        variant="checklist"
        name="job-status"
        legend="В настоящее время основное место работы"
        value={fields.jobStatus}
        options={JOB_STATUS_OPTIONS}
        onChange={changeJobStatus}
      />
    );
  }

  return (
    <>
      <div className={styles.group}>
        <span className={styles.label}>Дата выхода на работу</span>
        <CalendarInput
          value={fields.startDate}
          onChange={(value) => form.changeField("startDate", value)}
          placeholder="Выберите дату"
        />
      </div>

      <RadioGroup
        variant="checklist"
        name="employment-type"
        legend="Вид трудоустройства"
        value={fields.employmentType}
        options={EMPLOYMENT_TYPE_OPTIONS}
        onChange={changeEmploymentType}
      />
    </>
  );
}
