"use client";

import { TextArea } from "@/source/shared/ui/Inputs";
import type { LaboratoryProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: LaboratoryProfile;
  onChange: (value: LaboratoryProfile) => void;
}

export function LaboratoryProfileFields({ value, onChange }: Props) {
  return (
    <div className={s.form}>
      <label className={s.field}>
        <span className={s.label}>Область аккредитации лаборатории</span>
        <TextArea
          value={value.accreditation_area}
          onChange={(event) => onChange({ ...value, accreditation_area: event.target.value })}
          placeholder="Виды исследований и испытаний из области аккредитации"
          maxLength={5000}
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Комментарий</span>
        <TextArea
          value={value.comment}
          onChange={(event) => onChange({ ...value, comment: event.target.value })}
          placeholder="Дополнительные сведения о лаборатории"
          maxLength={5000}
        />
      </label>
    </div>
  );
}
