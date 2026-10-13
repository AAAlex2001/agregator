"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import Tabs from "@/source/shared/ui/Tabs";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { Field } from "../../shared";
import type { AuditCatalogs } from "../catalogs/types";
import type { AuditKind } from "./types";
import { AuditOrderFileField } from "./AuditOrderFileField";
import type { AuditBlockProps } from "./blockProps";

const KIND_TABS = [
  { id: "BASIC", label: "Базовый" },
  { id: "INTERIM", label: "Промежуточный" },
  { id: "SELECTIVE", label: "Выборочный" },
  { id: "CONSULTATION", label: "Консультация" },
];

interface AuditKindFieldsProps extends AuditBlockProps {
  catalogs: AuditCatalogs;
}

/** Тип аудита: для базового и промежуточного — учёт СТО, для выборочного — направления по п. 17 Приказа № 318. */
export function AuditKindFields({ value, onChange, catalogs }: AuditKindFieldsProps) {
  const withSto = value.audit_kind === "BASIC" || value.audit_kind === "INTERIM";

  return (
    <>
      <Field label="Тип аудита">
        <Tabs
          tabs={KIND_TABS}
          activeTab={value.audit_kind}
          onTabChange={(id) => onChange({ ...value, audit_kind: id as AuditKind })}
          variant="squared"
        />
      </Field>

      {withSto && (
        <Field label="Учитывать внутренние стандарты организации (СТО) в области промышленной безопасности">
          <YesNoField value={value.considers_sto} onChange={(next) => onChange({ ...value, considers_sto: next })} />
          {value.considers_sto && (
            <TextInput
              value={value.sto_name}
              onChange={(event) => onChange({ ...value, sto_name: event.target.value })}
              placeholder="Наименование и реквизиты СТО"
            />
          )}
          {value.considers_sto && (
            <AuditOrderFileField label="Файл СТО" value={value.sto_file} onChange={(next) => onChange({ ...value, sto_file: next })} />
          )}
        </Field>
      )}

      {value.audit_kind === "SELECTIVE" && (
        <Field label="Направления аудита по пункту 17 Приказа № 318">
          <MultiSelect
            id="audit-areas-p17"
            options={catalogs.audit_areas}
            value={value.audit_areas}
            onChange={(next) => onChange({ ...value, audit_areas: next })}
          />
        </Field>
      )}
    </>
  );
}
