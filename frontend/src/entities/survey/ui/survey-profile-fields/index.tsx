"use client";

import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { YesNoField } from "@/shared/ui/yes-no-field";
import type { SurveyOptions, SurveyProfileValues } from "../../model/types";
import { EducationFields } from "../education-fields";
import { QualificationFields } from "../qualification-fields";
import { RegistryFields } from "../registry-fields";

/** Редактируемая анкета изыскателя и варианты из справочников. */
interface SurveyProfileFieldsProps {
  value: SurveyProfileValues;
  options: SurveyOptions;
  onChange: (value: SurveyProfileValues) => void;
}

/** Собирает поля изыскателя для регистрации и редактирования анкеты. */
export function SurveyProfileFields({
  value,
  options,
  onChange,
}: SurveyProfileFieldsProps) {
  /** Обновляет сведения об образовании изыскателя. */
  function changeEducation(education: string) {
    onChange({
      ...value,
      education,
    });
  }

  /** Обновляет выбранные виды изысканий. */
  function changeKinds(kinds: string[]) {
    onChange({
      ...value,
      kinds,
    });
  }

  /** Обновляет направления, указанные свободным текстом. */
  function changeOtherKinds(kindsOther: string) {
    onChange({
      ...value,
      kinds_other: kindsOther,
    });
  }

  /** Обновляет отметку о прохождении НОК. */
  function changeNokPassed(nokPassed: boolean) {
    onChange({
      ...value,
      nok_passed: nokPassed,
    });
  }

  /** Обновляет номер специалиста в НРС. */
  function changeNrsNumber(nrsNumber: string) {
    onChange({
      ...value,
      nrs_number: nrsNumber,
    });
  }

  /** Обновляет отметку об участии в СРО как ГИП. */
  function changeSroGipDeclared(sroGipDeclared: boolean) {
    onChange({
      ...value,
      sro_gip_declared: sroGipDeclared,
    });
  }

  /** Обновляет описание курсов повышения квалификации. */
  function changeCourses(courses: string) {
    onChange({
      ...value,
      qualification_courses: courses,
    });
  }

  /** Обновляет выбранные области аттестации РТН. */
  function changeRtnAreas(rtnAreas: string[]) {
    onChange({
      ...value,
      rtn_areas: rtnAreas,
    });
  }

  return (
    <FieldStack>
      <EducationFields
        education={value.education}
        kinds={value.kinds}
        otherKinds={value.kinds_other}
        options={options.kinds}
        onEducationChange={changeEducation}
        onKindsChange={changeKinds}
        onOtherKindsChange={changeOtherKinds}
      />

      <Field label="Независимая оценка квалификации (НОК)">
        <YesNoField
          value={value.nok_passed}
          onChange={changeNokPassed}
        />
      </Field>

      <RegistryFields
        nrsNumber={value.nrs_number}
        sroGipDeclared={value.sro_gip_declared}
        onNrsNumberChange={changeNrsNumber}
        onSroGipDeclaredChange={changeSroGipDeclared}
      />

      <QualificationFields
        courses={value.qualification_courses}
        rtnAreas={value.rtn_areas}
        options={options.rtn_areas}
        onCoursesChange={changeCourses}
        onRtnAreasChange={changeRtnAreas}
      />
    </FieldStack>
  );
}
