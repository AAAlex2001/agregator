"use client";

import Tabs from "@/source/shared/ui/Tabs";
import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import type { DirectionFormProps } from "../model/types";
import s from "./DirectionForm.module.scss";

const WORKPLACE_TABS = [
  { id: "INDIVIDUAL", label: "Действую как физлицо" },
  { id: "ORGANIZATION", label: "Экспертная организация" },
];

export function ForensicExpertForm({ value, onChange }: DirectionFormProps) {
  const kind = String(value.workplace_kind ?? "INDIVIDUAL");
  const text = (field: string) => String(value[field] ?? "");
  const set = (field: string, next: unknown) => onChange({ ...value, [field]: next });

  return (
    <div className={s.form}>
      <label className={s.field}>
        <span className={s.label}>Образование</span>
        <TextArea
          value={text("education")}
          onChange={(event) => set("education", event.target.value)}
          placeholder="Учебное заведение, специальность, экспертная специальность"
          maxLength={5000}
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Опыт проведения аналогичных экспертиз</span>
        <TextArea
          value={text("similar_cases_experience")}
          onChange={(event) => set("similar_cases_experience", event.target.value)}
          placeholder="Категории дел, количество заключений, стаж"
          maxLength={5000}
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Кто выдаёт заключение</span>
        <Tabs
          tabs={WORKPLACE_TABS}
          activeTab={kind}
          onTabChange={(id) => set("workplace_kind", id)}
          variant="squared"
        />
      </div>

      {kind === "ORGANIZATION" && (
        <label className={s.field}>
          <span className={s.label}>Наименование экспертной организации</span>
          <TextInput
            value={text("workplace_name")}
            onChange={(event) => set("workplace_name", event.target.value)}
            placeholder="Общество с ограниченной ответственностью «…»"
          />
        </label>
      )}
    </div>
  );
}
