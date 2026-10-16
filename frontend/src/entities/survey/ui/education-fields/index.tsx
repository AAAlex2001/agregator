"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { MultiSelect } from "@/shared/ui/multi-select";
import { TextArea } from "@/shared/ui/text-area";
import { TextInput } from "@/shared/ui/text-input";
import type { SurveyKind } from "../../model/types";

/** Образование и выбранные направления работы изыскателя. */
interface EducationFieldsProps {
  education: string;
  kinds: string[];
  otherKinds: string;
  options: SurveyKind[];
  onEducationChange: (value: string) => void;
  onKindsChange: (value: string[]) => void;
  onOtherKindsChange: (value: string) => void;
}

/** Образование изыскателя и основные направления его работы. */
export function EducationFields({
  education,
  kinds,
  otherKinds,
  options,
  onEducationChange,
  onKindsChange,
  onOtherKindsChange,
}: EducationFieldsProps) {
  const educationId = useId();
  const kindsId = useId();
  const otherKindsId = useId();
  const kindOptions = options.map((option) => ({
    value: option.code,
    label: `${option.short} — ${option.title}`,
  }));

  /** Передаёт описание образования в анкету. */
  function changeEducation(event: ChangeEvent<HTMLTextAreaElement>) {
    onEducationChange(event.target.value);
  }

  /** Передаёт направления, которых нет в справочнике. */
  function changeOtherKinds(event: ChangeEvent<HTMLInputElement>) {
    onOtherKindsChange(event.target.value);
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
          placeholder="Учебное заведение, специальность, год окончания"
          maxLength={5000}
        />
      </Field>

      <Field
        label="Основные направления изысканий"
        htmlFor={kindsId}
      >
        <MultiSelect
          id={kindsId}
          options={kindOptions}
          value={kinds}
          onChange={onKindsChange}
        />
      </Field>

      <Field
        label="Другие направления изысканий"
        htmlFor={otherKindsId}
      >
        <TextInput
          id={otherKindsId}
          value={otherKinds}
          onChange={changeOtherKinds}
          placeholder="Если вашего направления нет в списке — впишите его"
        />
      </Field>
    </>
  );
}
