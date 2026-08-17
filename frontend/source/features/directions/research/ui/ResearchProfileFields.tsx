"use client";

import { TextArea } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { RadioGroup } from "@/source/shared/ui/RadioGroup";
import type { ResearchCatalogs, ResearchProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: ResearchProfile;
  onChange: (value: ResearchProfile) => void;
  catalogs: ResearchCatalogs;
}

function toRadioOptions(items: ResearchCatalogs["academic_degrees"], noneLabel: string) {
  return [
    { value: "", label: noneLabel },
    ...items.map((item) => ({ value: item.code, label: item.title })),
  ];
}

export function ResearchProfileFields({ value, onChange, catalogs }: Props) {
  return (
    <div className={s.form}>
      <div className={s.field}>
        <span className={s.label}>Учёная степень</span>
        <RadioGroup
          name="research-degree"
          value={value.academic_degree}
          options={toRadioOptions(catalogs.academic_degrees, "Нет учёной степени")}
          onChange={(next) =>
            onChange({ ...value, academic_degree: next, science_branches: next ? value.science_branches : [] })
          }
        />
      </div>

      {value.academic_degree && (
        <div className={s.field}>
          <span className={s.label}>Отрасли науки</span>
          <MultiSelect
            id="research-branches"
            options={catalogs.science_branches}
            value={value.science_branches}
            onChange={(next) => onChange({ ...value, science_branches: next })}
          />
        </div>
      )}

      <div className={s.field}>
        <span className={s.label}>Учёное звание</span>
        <RadioGroup
          name="research-title"
          value={value.academic_title}
          options={toRadioOptions(catalogs.academic_titles, "Нет учёного звания")}
          onChange={(next) => onChange({ ...value, academic_title: next })}
        />
      </div>

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
