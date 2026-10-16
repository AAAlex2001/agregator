"use client";

import { useId } from "react";
import { MultiSelect } from "@/shared/ui/multi-select";
import { Field } from "@/shared/ui/field";
import { TextArea } from "@/shared/ui/text-area";
import type { DesignSpecialty } from "../../model/types";

interface EducationFieldsProps {
  education: string;
  specialties: string[];
  options: DesignSpecialty[];
  onEducationChange: (value: string) => void;
  onSpecialtiesChange: (value: string[]) => void;
}

/** Образование проектировщика и выбранные специальности. */
export function EducationFields({
  education,
  specialties,
  options,
  onEducationChange,
  onSpecialtiesChange,
}: EducationFieldsProps) {
  const educationId = useId();
  const specialtiesId = useId();

  const specialtyOptions = options.map((option) => ({
    value: option.code,
    label: `${option.short} — ${option.title}`,
  }));

  return (
    <>
      <Field
        label="Образование"
        htmlFor={educationId}
      >
        <TextArea
          id={educationId}
          name="education"
          value={education}
          maxLength={5000}
          placeholder="Учебное заведение, специальность, год окончания"
          onChange={(event) => {
            onEducationChange(event.target.value);
          }}
        />
      </Field>

      <Field
        label="Основные направления проектирования"
        htmlFor={specialtiesId}
      >
        <MultiSelect
          id={specialtiesId}
          name="specialties"
          options={specialtyOptions}
          value={specialties}
          onChange={onSpecialtiesChange}
        />
      </Field>
    </>
  );
}
