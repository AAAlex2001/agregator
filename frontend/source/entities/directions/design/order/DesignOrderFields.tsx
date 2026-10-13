"use client";

import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { RadioGroup } from "@/source/shared/ui/RadioGroup";
import { ApplicantFields, Field, FieldStack } from "../../shared";
import type { DesignCatalogs } from "../catalogs/types";
import type { DesignOrderDetails, DesignOrderScope } from "./types";

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

interface DesignOrderFieldsProps {
  value: DesignOrderDetails;
  onChange: (value: DesignOrderDetails) => void;
  catalogs: DesignCatalogs;
}

/** Заявка на проектирование: объект, виды документации, объём работ и согласования. */
export function DesignOrderFields({ value, onChange, catalogs }: DesignOrderFieldsProps) {
  const changeScope = (scope: DesignOrderScope) =>
    onChange({ ...value, scope, sections: scope === "FULL" ? [] : value.sections });

  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </Field>

      <Field label="Наименование объекта">
        <TextInput
          value={value.object_name}
          onChange={(event) => onChange({ ...value, object_name: event.target.value })}
          placeholder="Как объект называется в задании на проектирование"
        />
      </Field>

      <Field label="Город строительства">
        <TextInput
          value={value.construction_city}
          onChange={(event) => onChange({ ...value, construction_city: event.target.value })}
          placeholder="Город"
        />
      </Field>

      <Field label="Направление разрабатываемой документации">
        <MultiSelect
          id="design-order-categories"
          options={catalogs.doc_categories}
          value={value.doc_categories}
          onChange={(next) => onChange({ ...value, doc_categories: next })}
        />
      </Field>

      <Field label="Вид документации">
        <MultiSelect
          id="design-order-kinds"
          options={catalogs.documentation_kinds}
          value={value.documentation_kinds}
          onChange={(next) => onChange({ ...value, documentation_kinds: next })}
        />
      </Field>

      <Field label="Объём разрабатываемой документации">
        <RadioGroup name="design-order-scope" value={value.scope} options={SCOPE_OPTIONS} onChange={changeScope} />
      </Field>

      {value.scope === "SECTIONS" && (
        <Field label="Разделы проектной документации">
          <MultiSelect
            id="design-order-sections"
            options={catalogs.specialties}
            value={value.sections}
            onChange={(next) => onChange({ ...value, sections: next })}
          />
        </Field>
      )}

      <Field label="Каким согласованиям и экспертизам подлежит">
        <MultiSelect
          id="design-order-approvals"
          options={catalogs.approvals}
          value={value.approvals}
          onChange={(next) => onChange({ ...value, approvals: next })}
        />
      </Field>

      <Field label="Иные согласования и экспертизы">
        <TextArea
          value={value.approvals_other}
          onChange={(event) => onChange({ ...value, approvals_other: event.target.value })}
          placeholder="Заполните в свободной форме, если нужны другие согласования"
          maxLength={2000}
        />
      </Field>
    </FieldStack>
  );
}
