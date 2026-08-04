"use client";

import Tabs from "@/source/shared/ui/Tabs";
import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { GeoSuggestInput } from "@/source/shared/ui/GeoSuggestInput";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import type { ForensicProfile, ForensicWorkplaceKind } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

const WORKPLACE_TABS = [
  { id: "INDIVIDUAL", label: "Действую как физлицо" },
  { id: "ORGANIZATION", label: "Экспертная организация" },
];

interface Props {
  value: ForensicProfile;
  onChange: (value: ForensicProfile) => void;
}

export function ForensicProfileFields({ value, onChange }: Props) {
  return (
    <div className={s.form}>
      <label className={s.field}>
        <span className={s.label}>Образование</span>
        <TextArea
          value={value.education}
          onChange={(event) => onChange({ ...value, education: event.target.value })}
          placeholder="Учебное заведение, специальность, экспертная специальность"
          maxLength={5000}
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Дополнительное образование, курсы</span>
        <TextArea
          value={value.extra_education}
          onChange={(event) => onChange({ ...value, extra_education: event.target.value })}
          placeholder="Курсы повышения квалификации, сертификаты"
          maxLength={5000}
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Опыт проведения аналогичных экспертиз</span>
        <YesNoField
          value={value.has_similar_experience}
          onChange={(next) => onChange({ ...value, has_similar_experience: next })}
        />
      </div>

      <div className={s.field}>
        <span className={s.label}>Учёная степень</span>
        <YesNoField
          value={value.has_degree}
          onChange={(next) => onChange({ ...value, has_degree: next, degree: next ? value.degree : "" })}
        />
        {value.has_degree && (
          <TextInput
            value={value.degree}
            onChange={(event) => onChange({ ...value, degree: event.target.value })}
            placeholder="Кандидат юридических наук"
          />
        )}
      </div>

      <div className={s.field}>
        <span className={s.label}>Местонахождение</span>
        <GeoSuggestInput
          value={value.city}
          onChange={(city) => onChange({ ...value, city })}
          placeholder="Город"
        />
      </div>

      <div className={s.field}>
        <span className={s.label}>Место работы</span>
        <Tabs
          tabs={WORKPLACE_TABS}
          activeTab={value.workplace_kind}
          onTabChange={(id) => onChange({ ...value, workplace_kind: id as ForensicWorkplaceKind })}
          variant="squared"
        />
        {value.workplace_kind === "ORGANIZATION" && (
          <TextInput
            value={value.workplace_name}
            onChange={(event) => onChange({ ...value, workplace_name: event.target.value })}
            placeholder="Наименование экспертной организации"
          />
        )}
      </div>
    </div>
  );
}
