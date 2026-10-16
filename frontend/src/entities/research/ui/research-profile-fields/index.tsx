"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { RadioGroup } from "@/shared/ui/radio-group";
import { TextArea } from "@/shared/ui/text-area";
import { changeAcademicDegree } from "../../model/profile-values";
import { toResearchSelectOptions } from "../../model/select-options";
import type { ResearchOptions, ResearchProfileValues } from "../../model/types";
import { AcademicDegreeFields } from "../academic-degree-fields";

/** Поля научной квалификации для регистрации и редактирования анкеты. */
interface ResearchProfileFieldsProps {
  value: ResearchProfileValues;
  options: ResearchOptions;
  disabled?: boolean;
  onChange: (value: ResearchProfileValues) => void;
}

/** Собирает квалификацию исследователя и описание его научной деятельности. */
export function ResearchProfileFields({
  value,
  options,
  disabled = false,
  onChange,
}: ResearchProfileFieldsProps) {
  const titleName = useId();
  const researchId = useId();
  const titleOptions = [
    {
      value: "",
      label: "Нет учёного звания",
    },
    ...toResearchSelectOptions(options.academic_titles),
  ];

  /** Меняет степень и очищает отрасли только при её отсутствии. */
  function changeDegree(degree: string) {
    onChange(changeAcademicDegree(value, degree));
  }

  /** Сохраняет выбранные отрасли науки. */
  function changeBranches(branches: string[]) {
    onChange({
      ...value,
      science_branches: branches,
    });
  }

  /** Сохраняет учёное звание независимо от степени. */
  function changeTitle(title: string) {
    onChange({
      ...value,
      academic_title: title,
    });
  }

  /** Передаёт в черновик описание исследований. */
  function changeResearchField(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      research_field: event.target.value,
    });
  }

  return (
    <FieldStack>
      <AcademicDegreeFields
        degree={value.academic_degree}
        branches={value.science_branches}
        degrees={options.academic_degrees}
        scienceBranches={options.science_branches}
        disabled={disabled}
        onDegreeChange={changeDegree}
        onBranchesChange={changeBranches}
      />

      <Field label="Учёное звание">
        <RadioGroup
          name={titleName}
          value={value.academic_title}
          options={titleOptions}
          disabled={disabled}
          onChange={changeTitle}
        />
      </Field>

      <Field
        label="Направление научной деятельности"
        htmlFor={researchId}
      >
        <TextArea
          id={researchId}
          value={value.research_field}
          disabled={disabled}
          onChange={changeResearchField}
          placeholder="Область исследований, ключевые темы работ"
          maxLength={5000}
        />
      </Field>
    </FieldStack>
  );
}
