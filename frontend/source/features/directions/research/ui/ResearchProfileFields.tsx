"use client";

import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import type { ResearchProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: ResearchProfile;
  onChange: (value: ResearchProfile) => void;
}

export function ResearchProfileFields({ value, onChange }: Props) {
  return (
    <div className={s.form}>
      <label className={s.field}>
        <span className={s.label}>Учёная степень (при наличии)</span>
        <TextInput
          value={value.academic_degree}
          onChange={(event) => onChange({ ...value, academic_degree: event.target.value })}
          placeholder="Кандидат технических наук"
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Учёное звание (при наличии)</span>
        <TextInput
          value={value.academic_title}
          onChange={(event) => onChange({ ...value, academic_title: event.target.value })}
          placeholder="Доцент"
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Направление научной деятельности</span>
        <TextArea
          value={value.research_field}
          onChange={(event) => onChange({ ...value, research_field: event.target.value })}
          placeholder="Область исследований, ключевые темы работ"
          maxLength={5000}
        />
      </label>
    </div>
  );
}
