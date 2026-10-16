"use client";

import { useId } from "react";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { MultiSelect } from "@/shared/ui/multi-select";
import type {
  AuditExpertProfileValues,
  AuditOptions,
} from "../../model/types";

/** Анкета аудитора и доступные области из справочников. */
interface AuditExpertProfileFieldsProps {
  value: AuditExpertProfileValues;
  options: AuditOptions;
  onChange: (profile: AuditExpertProfileValues) => void;
}

/** Показывает области аттестации и независимую оценку квалификации аудитора. */
export function AuditExpertProfileFields({
  value,
  options,
  onChange,
}: AuditExpertProfileFieldsProps) {
  const id = useId();

  /** Меняет выбранные области промышленной безопасности. */
  function changeSafetyAreas(areas: string[]) {
    onChange({
      ...value,
      industrial_safety_areas: areas,
    });
  }

  /** Меняет выбранные области экспертной аттестации. */
  function changeExpertAreas(areas: string[]) {
    onChange({
      ...value,
      expert_attestation_areas: areas,
    });
  }

  /** Меняет выбранные квалификации аудитора. */
  function changeQualifications(qualifications: string[]) {
    onChange({
      ...value,
      audit_qualifications: qualifications,
    });
  }

  return (
    <FieldStack>
      <Field label="Области аттестации по промышленной безопасности">
        <MultiSelect
          id={`${id}-safety`}
          options={options.industrialSafetyAreas}
          value={value.industrial_safety_areas}
          onChange={changeSafetyAreas}
        />
      </Field>
      <Field label="Области аттестации как эксперта">
        <MultiSelect
          id={`${id}-expert-areas`}
          options={options.expertAttestationAreas}
          value={value.expert_attestation_areas}
          onChange={changeExpertAreas}
        />
      </Field>
      <Field label="Независимая оценка квалификации по аудиту">
        <MultiSelect
          id={`${id}-qualifications`}
          options={options.auditQualifications}
          value={value.audit_qualifications}
          onChange={changeQualifications}
        />
      </Field>
    </FieldStack>
  );
}
