"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { MultiSelect } from "@/shared/ui/multi-select";
import { TextArea } from "@/shared/ui/text-area";
import type { SurveyOption } from "../../model/types";

/** Курсы и выбранные области аттестации изыскателя. */
interface QualificationFieldsProps {
  courses: string;
  rtnAreas: string[];
  options: SurveyOption[];
  onCoursesChange: (value: string) => void;
  onRtnAreasChange: (value: string[]) => void;
}

/** Курсы повышения квалификации изыскателя и области аттестации РТН. */
export function QualificationFields({
  courses,
  rtnAreas,
  options,
  onCoursesChange,
  onRtnAreasChange,
}: QualificationFieldsProps) {
  const coursesId = useId();
  const rtnId = useId();
  const rtnOptions = options.map((option) => ({
    value: option.code,
    label: `${option.code} — ${option.title}`,
  }));

  /** Передаёт сведения о повышении квалификации в анкету. */
  function changeCourses(event: ChangeEvent<HTMLTextAreaElement>) {
    onCoursesChange(event.target.value);
  }

  return (
    <>
      <Field
        label="Повышение квалификации, курсы"
        htmlFor={coursesId}
      >
        <TextArea
          id={coursesId}
          value={courses}
          onChange={changeCourses}
          placeholder="Программы, учебные центры и годы прохождения"
          maxLength={5000}
        />
      </Field>

      <Field
        label="Аттестация в РТН по промышленной безопасности"
        htmlFor={rtnId}
      >
        <MultiSelect
          id={rtnId}
          options={rtnOptions}
          value={rtnAreas}
          onChange={onRtnAreasChange}
        />
      </Field>
    </>
  );
}
