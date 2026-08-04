"use client";

import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { GeoSuggestInput } from "@/source/shared/ui/GeoSuggestInput";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { ApplicantFields } from "../../shared/ui/ApplicantFields";
import type { ForensicOrderDetails } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: ForensicOrderDetails;
  onChange: (value: ForensicOrderDetails) => void;
}

export function ForensicOrderFields({ value, onChange }: Props) {
  return (
    <div className={s.form}>
      <div className={s.field}>
        <span className={s.label}>Сведения о заявителе</span>
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </div>

      <label className={s.field}>
        <span className={s.label}>Цель экспертизы</span>
        <TextArea
          value={value.expertise_purpose}
          onChange={(event) => onChange({ ...value, expertise_purpose: event.target.value })}
          placeholder="Какие вопросы должна разрешить экспертиза"
          maxLength={5000}
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Государственный орган</span>
        <TextInput
          value={value.government_body}
          onChange={(event) => onChange({ ...value, government_body: event.target.value })}
          placeholder="Куда требуется предоставить заключение"
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Где находится предмет экспертизы</span>
        <GeoSuggestInput
          value={value.city}
          onChange={(city) => onChange({ ...value, city })}
          placeholder="Город"
        />
      </div>

      <label className={s.field}>
        <span className={s.label}>Требования к образованию эксперта</span>
        <TextArea
          value={value.education_requirement}
          onChange={(event) => onChange({ ...value, education_requirement: event.target.value })}
          placeholder="Экспертная специальность, профильное образование"
          maxLength={5000}
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Дополнительные требования</span>
        <TextArea
          value={value.extra_requirements}
          onChange={(event) => onChange({ ...value, extra_requirements: event.target.value })}
          placeholder="Стаж, сертификаты, допуски"
          maxLength={5000}
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Обязателен опыт аналогичных экспертиз</span>
        <YesNoField
          value={value.similar_experience_required}
          onChange={(next) => onChange({ ...value, similar_experience_required: next })}
        />
      </div>

      <label className={s.field}>
        <span className={s.label}>Срок проведения экспертизы</span>
        <TextInput
          value={value.duration}
          onChange={(event) => onChange({ ...value, duration: event.target.value })}
          placeholder="30 дней"
        />
      </label>

      <span className={s.hint}>Вопросы эксперту приложите в файлах заявки ниже.</span>
    </div>
  );
}
