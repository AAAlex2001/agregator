"use client";

import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { RadioGroup } from "@/source/shared/ui/RadioGroup";
import { ApplicantFields } from "../../shared/ui/ApplicantFields";
import type { DesignCatalogs, DesignOrderDetails, DesignOrderScope } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: DesignOrderDetails;
  onChange: (value: DesignOrderDetails) => void;
  catalogs: DesignCatalogs;
}

const SCOPE_OPTIONS = [
  {
    value: "FULL" as const,
    label: "Полный пакет документации",
    description: "Заявку увидят исполнители всех разделов проектной документации",
  },
  {
    value: "SECTIONS" as const,
    label: "Отдельные разделы",
    description: "Укажите нужные разделы — заявка уйдёт специалистам по этим областям",
  },
];

export function DesignOrderFields({ value, onChange, catalogs }: Props) {
  return (
    <div className={s.form}>
      <div className={s.field}>
        <span className={s.label}>Сведения о заявителе</span>
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </div>

      <label className={s.field}>
        <span className={s.label}>Наименование объекта</span>
        <TextInput
          value={value.object_name}
          onChange={(event) => onChange({ ...value, object_name: event.target.value })}
          placeholder="Как объект называется в задании на проектирование"
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Город строительства</span>
        <TextInput
          value={value.construction_city}
          onChange={(event) => onChange({ ...value, construction_city: event.target.value })}
          placeholder="Город"
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Направление разрабатываемой документации</span>
        <MultiSelect
          id="design-order-categories"
          options={catalogs.doc_categories}
          value={value.doc_categories}
          onChange={(next) => onChange({ ...value, doc_categories: next })}
        />
      </div>

      <div className={s.field}>
        <span className={s.label}>Вид документации</span>
        <MultiSelect
          id="design-order-kinds"
          options={catalogs.documentation_kinds}
          value={value.documentation_kinds}
          onChange={(next) => onChange({ ...value, documentation_kinds: next })}
        />
      </div>

      <div className={s.field}>
        <span className={s.label}>Объём разрабатываемой документации</span>
        <RadioGroup
          name="design-order-scope"
          value={value.scope}
          options={SCOPE_OPTIONS}
          onChange={(next: DesignOrderScope) =>
            onChange({ ...value, scope: next, sections: next === "FULL" ? [] : value.sections })
          }
        />
      </div>

      {value.scope === "SECTIONS" && (
        <div className={s.field}>
          <span className={s.label}>Разделы проектной документации</span>
          <MultiSelect
            id="design-order-sections"
            options={catalogs.specialties}
            value={value.sections}
            onChange={(next) => onChange({ ...value, sections: next })}
          />
        </div>
      )}

      <div className={s.field}>
        <span className={s.label}>Каким согласованиям и экспертизам подлежит</span>
        <MultiSelect
          id="design-order-approvals"
          options={catalogs.approvals}
          value={value.approvals}
          onChange={(next) => onChange({ ...value, approvals: next })}
        />
      </div>

      <label className={s.field}>
        <span className={s.label}>Иные согласования и экспертизы</span>
        <TextArea
          value={value.approvals_other}
          onChange={(event) => onChange({ ...value, approvals_other: event.target.value })}
          placeholder="Заполните в свободной форме, если нужны другие согласования"
          maxLength={2000}
        />
      </label>
    </div>
  );
}
