"use client";

import Tabs from "@/source/shared/ui/Tabs";
import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import type { ForensicExpertProfile, ForensicWorkplaceKind } from "@/source/entities/direction";
import type { DirectionFormProps } from "../model/types";
import s from "./DirectionForm.module.scss";

const WORKPLACE_TABS = [
  { id: "INDIVIDUAL", label: "Действую как физлицо" },
  { id: "ORGANIZATION", label: "Экспертная организация" },
];

export function ForensicExpertForm({ value, onChange }: DirectionFormProps<ForensicExpertProfile>) {
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
        <span className={s.label}>Опыт проведения аналогичных экспертиз</span>
        <TextArea
          value={value.similar_cases_experience}
          onChange={(event) =>
            onChange({ ...value, similar_cases_experience: event.target.value })
          }
          placeholder="Категории дел, количество заключений, стаж"
          maxLength={5000}
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Кто выдаёт заключение</span>
        <Tabs
          tabs={WORKPLACE_TABS}
          activeTab={value.workplace_kind}
          onTabChange={(id) =>
            onChange({ ...value, workplace_kind: id as ForensicWorkplaceKind })
          }
          variant="squared"
        />
      </div>

      {value.workplace_kind === "ORGANIZATION" && (
        <label className={s.field}>
          <span className={s.label}>Наименование экспертной организации</span>
          <TextInput
            value={value.workplace_name}
            onChange={(event) => onChange({ ...value, workplace_name: event.target.value })}
            placeholder="Общество с ограниченной ответственностью «…»"
          />
        </label>
      )}
    </div>
  );
}
