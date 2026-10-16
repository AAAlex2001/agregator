"use client";

import { useId } from "react";
import { MultiSelect } from "@/shared/ui/multi-select";
import { Field } from "@/shared/ui/field";
import { TextArea } from "@/shared/ui/text-area";
import type { DesignOption } from "../../model/types";

interface QualificationFieldsProps {
  courses: string;
  rtnAreas: string[];
  options: DesignOption[];
  onCoursesChange: (value: string) => void;
  onRtnAreasChange: (value: string[]) => void;
}

/** Пройденные курсы и области аттестации РТН. */
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
    label: option.title,
  }));

  return (
    <>
      <Field
        label="Повышение квалификации, курсы"
        htmlFor={coursesId}
      >
        <TextArea
          id={coursesId}
          name="qualification_courses"
          value={courses}
          maxLength={5000}
          placeholder="Программы, учебные центры и годы прохождения"
          onChange={(event) => {
            onCoursesChange(event.target.value);
          }}
        />
      </Field>

      <Field
        label="Аттестация в РТН по промышленной безопасности"
        htmlFor={rtnId}
      >
        <MultiSelect
          id={rtnId}
          name="rtn_areas"
          options={rtnOptions}
          value={rtnAreas}
          onChange={onRtnAreasChange}
        />
      </Field>
    </>
  );
}
