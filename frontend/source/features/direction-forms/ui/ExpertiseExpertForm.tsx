"use client";

import { ExpertAttestationFields } from "@/source/entities/expertise";
import type { ExpertiseExpertProfile } from "@/source/entities/direction";
import type { DirectionFormProps } from "../model/types";
import s from "./DirectionForm.module.scss";

export function ExpertiseExpertForm({
  value,
  onChange,
}: DirectionFormProps<ExpertiseExpertProfile>) {
  return (
    <div className={s.form}>
      <ExpertAttestationFields
        certificates={value.certificates}
        onChangeCertificates={(certificates) => onChange({ ...value, certificates })}
      />
    </div>
  );
}
