"use client";

import { TextArea } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import type { EcologyCatalogs, EcologyProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: EcologyProfile;
  onChange: (value: EcologyProfile) => void;
  catalogs: EcologyCatalogs;
}

export function EcologyProfileFields({ value, onChange, catalogs }: Props) {
  return (
    <div className={s.form}>
      <div className={s.field}>
        <span className={s.label}>Какие виды работ вы выполняете</span>
        <MultiSelect
          id="ecology-work-types"
          options={catalogs.work_types}
          value={value.work_types}
          onChange={(next) => onChange({ ...value, work_types: next })}
        />
      </div>

      <label className={s.field}>
        <span className={s.label}>Практические навыки</span>
        <TextArea
          value={value.practical_skills}
          onChange={(event) => onChange({ ...value, practical_skills: event.target.value })}
          placeholder="Знание законодательства, работа с отчётными формами, расчёты платы за НВОС, взаимодействие с контролирующими органами"
          maxLength={5000}
        />
      </label>
    </div>
  );
}
