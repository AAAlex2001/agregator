"use client";

import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { TextInput } from "@/shared/ui/text-input";
import { YesNoField } from "@/shared/ui/yes-no-field";
import type { ForensicProfileValues, ForensicWorkplaceKind } from "../../model/types";
import { EducationFields } from "../education-fields";
import { WorkplaceFields } from "../workplace-fields";

/** Редактируемые сведения эксперта и передача изменений в форму. */
interface ForensicProfileFieldsProps {
  value: ForensicProfileValues;
  onChange: (value: ForensicProfileValues) => void;
}

/** Образование, опыт и условия работы судебного эксперта. */
export function ForensicProfileFields({
  value,
  onChange,
}: ForensicProfileFieldsProps) {
  /** Обновляет сведения об основном образовании. */
  function changeEducation(education: string) {
    onChange({
      ...value,
      education,
    });
  }

  /** Обновляет сведения о курсах и дополнительном образовании. */
  function changeExtraEducation(extraEducation: string) {
    onChange({
      ...value,
      extra_education: extraEducation,
    });
  }

  /** Отмечает опыт проведения аналогичных экспертиз. */
  function changeExperience(hasExperience: boolean) {
    onChange({
      ...value,
      has_similar_experience: hasExperience,
    });
  }

  /** Очищает название степени, если эксперт указал её отсутствие. */
  function changeHasDegree(hasDegree: boolean) {
    onChange({
      ...value,
      has_degree: hasDegree,
      degree: hasDegree ? value.degree : "",
    });
  }

  /** Обновляет название учёной степени. */
  function changeDegree(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      degree: event.target.value,
    });
  }

  /** Обновляет город судебного эксперта. */
  function changeCity(city: string) {
    onChange({
      ...value,
      city,
    });
  }

  /** Меняет форму работы, сохраняя введённое название организации. */
  function changeWorkplaceKind(workplaceKind: ForensicWorkplaceKind) {
    onChange({
      ...value,
      workplace_kind: workplaceKind,
    });
  }

  /** Обновляет название экспертной организации. */
  function changeWorkplaceName(workplaceName: string) {
    onChange({
      ...value,
      workplace_name: workplaceName,
    });
  }

  return (
    <FieldStack>
      <EducationFields
        education={value.education}
        extraEducation={value.extra_education}
        onEducationChange={changeEducation}
        onExtraEducationChange={changeExtraEducation}
      />

      <Field label="Опыт проведения аналогичных экспертиз">
        <YesNoField
          value={value.has_similar_experience}
          onChange={changeExperience}
        />
      </Field>

      <Field label="Учёная степень">
        <YesNoField
          value={value.has_degree}
          onChange={changeHasDegree}
        />
        {value.has_degree && (
          <TextInput
            value={value.degree}
            onChange={changeDegree}
            placeholder="Кандидат юридических наук"
          />
        )}
      </Field>

      <WorkplaceFields
        city={value.city}
        kind={value.workplace_kind}
        name={value.workplace_name}
        onCityChange={changeCity}
        onKindChange={changeWorkplaceKind}
        onNameChange={changeWorkplaceName}
      />
    </FieldStack>
  );
}
