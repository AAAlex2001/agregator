"use client";

import { SelectInput, TextArea } from "@/source/shared/ui/Inputs";
import type { ResearchCatalogs, ResearchProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: ResearchProfile;
  onChange: (value: ResearchProfile) => void;
  catalogs: ResearchCatalogs;
}

function toOptions(items: ResearchCatalogs["academic_degrees"]) {
  return items.map((item) => ({ value: item.code, label: item.title }));
}

export function ResearchProfileFields({ value, onChange, catalogs }: Props) {
  return (
    <div className={s.form}>
      <label className={s.field}>
        <span className={s.label}>Учёная степень (при наличии)</span>
        <SelectInput
          id="research-degree"
          value={value.academic_degree}
          options={toOptions(catalogs.academic_degrees)}
          onChange={(next) => onChange({ ...value, academic_degree: next, science_branch: next ? value.science_branch : "" })}
          placeholder="Нет учёной степени"
        />
      </label>

      {value.academic_degree && (
        <label className={s.field}>
          <span className={s.label}>Отрасль науки</span>
          <SelectInput
            id="research-branch"
            value={value.science_branch}
            options={toOptions(catalogs.science_branches)}
            onChange={(next) => onChange({ ...value, science_branch: next })}
            placeholder="Выберите отрасль науки"
          />
        </label>
      )}

      <label className={s.field}>
        <span className={s.label}>Учёное звание (при наличии)</span>
        <SelectInput
          id="research-title"
          value={value.academic_title}
          options={toOptions(catalogs.academic_titles)}
          onChange={(next) => onChange({ ...value, academic_title: next })}
          placeholder="Нет учёного звания"
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
