"use client";

import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { Field, FieldStack } from "../../shared";
import type { AuditCatalogs } from "../catalogs/types";
import type { AuditExpertProfile } from "./types";

interface AuditExpertProfileFieldsProps {
  value: AuditExpertProfile;
  onChange: (value: AuditExpertProfile) => void;
  catalogs: AuditCatalogs;
}

/** Анкета аудитора: области аттестации и независимая оценка квалификации. */
export function AuditExpertProfileFields({ value, onChange, catalogs }: AuditExpertProfileFieldsProps) {
  return (
    <FieldStack>
      <Field label="Области аттестации по промышленной безопасности">
        <MultiSelect
          id="audit-safety"
          options={catalogs.industrial_safety_areas}
          value={value.industrial_safety_areas}
          onChange={(next) => onChange({ ...value, industrial_safety_areas: next })}
        />
      </Field>
      <Field label="Области аттестации как эксперта">
        <MultiSelect
          id="audit-expert-areas"
          options={catalogs.expert_attestation_areas}
          value={value.expert_attestation_areas}
          onChange={(next) => onChange({ ...value, expert_attestation_areas: next })}
        />
      </Field>
      <Field label="Независимая оценка квалификации по аудиту">
        <MultiSelect
          id="audit-nok"
          options={catalogs.audit_qualifications}
          value={value.audit_qualifications}
          onChange={(next) => onChange({ ...value, audit_qualifications: next })}
        />
      </Field>
    </FieldStack>
  );
}
