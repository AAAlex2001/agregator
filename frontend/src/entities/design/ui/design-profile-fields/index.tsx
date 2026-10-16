"use client";

import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { YesNoField } from "@/shared/ui/yes-no-field";
import type { DesignOptions, DesignProfileValues } from "../../model/types";
import { EducationFields } from "../education-fields";
import { QualificationFields } from "../qualification-fields";
import { RegistryFields } from "../registry-fields";

interface DesignProfileFieldsProps {
  value: DesignProfileValues;
  options: DesignOptions;
  onChange: (value: DesignProfileValues) => void;
}

/** Поля анкеты проектировщика для регистрации и редактирования профиля. */
export function DesignProfileFields({
  value,
  options,
  onChange,
}: DesignProfileFieldsProps) {
  return (
    <FieldStack>
      <EducationFields
        education={value.education}
        specialties={value.specialties}
        options={options.specialties}
        onEducationChange={(education) => {
          onChange({
            ...value,
            education,
          });
        }}
        onSpecialtiesChange={(specialties) => {
          onChange({
            ...value,
            specialties,
          });
        }}
      />

      <Field label="Независимая оценка квалификации (НОК)">
        <YesNoField
          value={value.nok_passed}
          onChange={(nokPassed) => {
            onChange({
              ...value,
              nok_passed: nokPassed,
            });
          }}
        />
      </Field>

      <RegistryFields
        nrsNumber={value.nrs_number}
        sroGipDeclared={value.sro_gip_declared}
        onNrsNumberChange={(nrsNumber) => {
          onChange({
            ...value,
            nrs_number: nrsNumber,
          });
        }}
        onSroGipDeclaredChange={(sroGipDeclared) => {
          onChange({
            ...value,
            sro_gip_declared: sroGipDeclared,
          });
        }}
      />

      <QualificationFields
        courses={value.qualification_courses}
        rtnAreas={value.rtn_areas}
        options={options.rtn_areas}
        onCoursesChange={(courses) => {
          onChange({
            ...value,
            qualification_courses: courses,
          });
        }}
        onRtnAreasChange={(rtnAreas) => {
          onChange({
            ...value,
            rtn_areas: rtnAreas,
          });
        }}
      />
    </FieldStack>
  );
}
