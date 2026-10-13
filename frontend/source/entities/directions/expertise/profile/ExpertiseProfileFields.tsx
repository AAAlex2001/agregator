"use client";

import { ExpertAttestationFields } from "@/source/entities/expertise";
import type { ExpertiseProfile } from "./types";

interface ExpertiseProfileFieldsProps {
  value: ExpertiseProfile;
  onChange: (value: ExpertiseProfile) => void;
}

/** Анкета эксперта ЭПБ: удостоверения с областями аттестации. */
export function ExpertiseProfileFields({ value, onChange }: ExpertiseProfileFieldsProps) {
  return (
    <ExpertAttestationFields
      certificates={value.certificates}
      onChangeCertificates={(certificates) => onChange({ ...value, certificates })}
    />
  );
}
