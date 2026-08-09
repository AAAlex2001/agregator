"use client";

import { TextArea } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import type { TechDiagCatalogs, TechDiagProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: TechDiagProfile;
  onChange: (value: TechDiagProfile) => void;
  catalogs: TechDiagCatalogs;
}

export function TechDiagProfileFields({ value, onChange, catalogs }: Props) {
  return (
    <div className={s.form}>
      <label className={s.field}>
        <span className={s.label}>Квалификационные удостоверения</span>
        <TextArea
          value={value.qualification_certificates}
          onChange={(event) =>
            onChange({ ...value, qualification_certificates: event.target.value })
          }
          placeholder="Номера удостоверений, уровни квалификации и методы контроля"
          maxLength={5000}
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Виды неразрушающего контроля</span>
        <MultiSelect
          id="tech-diag-methods"
          options={catalogs.methods}
          value={value.methods}
          onChange={(next) => onChange({ ...value, methods: next })}
        />
      </div>

      <div className={s.field}>
        <span className={s.label}>Объекты контроля согласно СДАНК-02-2020</span>
        <MultiSelect
          id="tech-diag-objects"
          options={catalogs.control_objects}
          value={value.control_objects}
          onChange={(next) => onChange({ ...value, control_objects: next })}
        />
      </div>
    </div>
  );
}
