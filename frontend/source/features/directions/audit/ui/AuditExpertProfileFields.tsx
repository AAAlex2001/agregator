"use client";

import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import type { AuditCatalogs, AuditExpertProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: AuditExpertProfile;
  onChange: (value: AuditExpertProfile) => void;
  catalogs: AuditCatalogs;
}

export function AuditExpertProfileFields({ value, onChange, catalogs }: Props) {
  return (
    <div className={s.form}>
      <div className={s.field}>
        <span className={s.label}>Области аттестации по промышленной безопасности</span>
        <MultiSelect
          id="audit-safety"
          options={catalogs.industrial_safety_areas}
          value={value.industrial_safety_areas}
          onChange={(next) => onChange({ ...value, industrial_safety_areas: next })}
        />
      </div>

      <div className={s.field}>
        <span className={s.label}>Области аттестации как эксперта</span>
        <MultiSelect
          id="audit-expert-areas"
          options={catalogs.expert_attestation_areas}
          value={value.expert_attestation_areas}
          onChange={(next) => onChange({ ...value, expert_attestation_areas: next })}
        />
      </div>

      <div className={s.field}>
        <span className={s.label}>Независимая оценка квалификации по аудиту</span>
        <MultiSelect
          id="audit-nok"
          options={catalogs.audit_qualifications}
          value={value.audit_qualifications}
          onChange={(next) => onChange({ ...value, audit_qualifications: next })}
        />
      </div>
    </div>
  );
}
