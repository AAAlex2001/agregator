import type { EmploymentType } from "@/source/entities/labor";
import {
  CalendarInput,
  RadioGroup,
} from "@/source/shared/ui";
import s from "./LaborForm.module.scss";

interface LicenseEmploymentFieldsProps {
  startDate: string;
  employmentType: EmploymentType;
  onStartDateChange: (value: string) => void;
  onEmploymentTypeChange: (value: EmploymentType) => void;
}

export function LicenseEmploymentFields({
  startDate,
  employmentType,
  onStartDateChange,
  onEmploymentTypeChange,
}: LicenseEmploymentFieldsProps) {
  return (
    <>
      <div className={s.fieldGroup}>
        <span className={s.label}>Дата выхода на работу</span>
        <CalendarInput
          value={startDate}
          onChange={onStartDateChange}
          placeholder="Выберите дату"
        />
      </div>

      <RadioGroup
        name="employment-type"
        value={employmentType}
        onChange={onEmploymentTypeChange}
        legend="Вид трудоустройства"
        options={[
          {
            value: "PRIMARY",
            label: "Основное место работы",
            description: "Для соблюдения лицензионных требований",
          },
          {
            value: "PART_TIME",
            label: "По совместительству",
            description:
              "Дополнительные исполнители для выполнения работ",
          },
        ]}
      />
    </>
  );
}
