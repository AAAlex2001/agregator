"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { TextArea } from "@/shared/ui/text-area";

/** Тексты основного и дополнительного образования с обработчиками изменения. */
interface EducationFieldsProps {
  education: string;
  extraEducation: string;
  onEducationChange: (value: string) => void;
  onExtraEducationChange: (value: string) => void;
}

/** Основное и дополнительное образование судебного эксперта. */
export function EducationFields({
  education,
  extraEducation,
  onEducationChange,
  onExtraEducationChange,
}: EducationFieldsProps) {
  const educationId = useId();
  const extraEducationId = useId();

  /** Передаёт сведения об основном образовании в анкету. */
  function changeEducation(event: ChangeEvent<HTMLTextAreaElement>) {
    onEducationChange(event.target.value);
  }

  /** Передаёт сведения о курсах и дополнительном образовании. */
  function changeExtraEducation(event: ChangeEvent<HTMLTextAreaElement>) {
    onExtraEducationChange(event.target.value);
  }

  return (
    <>
      <Field
        label="Образование"
        htmlFor={educationId}
      >
        <TextArea
          id={educationId}
          value={education}
          onChange={changeEducation}
          placeholder="Учебное заведение, специальность, экспертная специальность"
          maxLength={5000}
        />
      </Field>

      <Field
        label="Дополнительное образование, курсы"
        htmlFor={extraEducationId}
      >
        <TextArea
          id={extraEducationId}
          value={extraEducation}
          onChange={changeExtraEducation}
          placeholder="Курсы повышения квалификации, сертификаты"
          maxLength={5000}
        />
      </Field>
    </>
  );
}
