"use client";

import { ExpertAttestationFields, type ExpertCertificate } from "@/source/entities/expertise";
import type { DirectionFormProps } from "../model/types";
import s from "./DirectionForm.module.scss";

export function ExpertiseExpertForm({ value, onChange }: DirectionFormProps) {
  const certificates = Array.isArray(value.certificates)
    ? (value.certificates as ExpertCertificate[])
    : [];

  return (
    <div className={s.form}>
      <ExpertAttestationFields
        certificates={certificates}
        onChangeCertificates={(next) => onChange({ ...value, certificates: next })}
      />
    </div>
  );
}
