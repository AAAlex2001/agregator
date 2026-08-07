"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import type { AuditCatalogs, AuditLicenseHolderProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: AuditLicenseHolderProfile;
  onChange: (value: AuditLicenseHolderProfile) => void;
  catalogs: AuditCatalogs;
}

export function AuditLicenseHolderProfileFields({ value, onChange, catalogs }: Props) {
  return (
    <div className={s.form}>
      <label className={s.field}>
        <span className={s.label}>№ свидетельства об аккредитации</span>
        <TextInput
          value={value.certificate_number}
          onChange={(event) => onChange({ ...value, certificate_number: event.target.value })}
          placeholder="RA.RU.010001"
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Области аккредитации по аудиту СУПБ</span>
        <MultiSelect
          id="audit-holder-accreditation"
          options={catalogs.accreditation_areas}
          value={value.accreditation_areas}
          onChange={(next) => onChange({ ...value, accreditation_areas: next })}
        />
      </div>
    </div>
  );
}
