"use client";

import { ExpertAttestationFields } from "@/source/entities/expertise";
import type { ExpertiseProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: ExpertiseProfile;
  onChange: (value: ExpertiseProfile) => void;
}

export function ExpertiseProfileFields({ value, onChange }: Props) {
  return (
    <div className={s.form}>
      <ExpertAttestationFields
        certificates={value.certificates}
        onChangeCertificates={(certificates) => onChange({ ...value, certificates })}
      />
    </div>
  );
}
