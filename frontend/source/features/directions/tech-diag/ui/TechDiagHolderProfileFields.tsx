"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import type { TechDiagCatalogs, TechDiagHolderProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: TechDiagHolderProfile;
  onChange: (value: TechDiagHolderProfile) => void;
  catalogs: TechDiagCatalogs;
}

export function TechDiagHolderProfileFields({ value, onChange, catalogs }: Props) {
  return (
    <div className={s.form}>
      <div className={s.field}>
        <span className={s.label}>Виды неразрушающего контроля</span>
        <MultiSelect
          id="tech-diag-holder-methods"
          options={catalogs.methods}
          value={value.methods}
          onChange={(next) => onChange({ ...value, methods: next })}
        />
      </div>

      <label className={s.field}>
        <span className={s.label}>Где находится организация</span>
        <TextInput
          value={value.organization_city}
          onChange={(event) => onChange({ ...value, organization_city: event.target.value })}
          placeholder="Город"
        />
      </label>
    </div>
  );
}
