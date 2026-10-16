"use client";

import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { MultiSelect } from "@/shared/ui/multi-select";
import { Tabs } from "@/shared/ui/tabs";
import { TextInput } from "@/shared/ui/text-input";
import { YesNoField } from "@/shared/ui/yes-no-field";
import type { AuditOrderDetails, AuditOrderDocument } from "../../model/details/audit";
import type { OrderFieldOption } from "../../model/order-field-option";
import { AuditOrderDocumentField } from "../audit-order-document-field";

/** Вопрос об учёте внутренних стандартов организации. */
const STANDARDS_LABEL = "Учитывать внутренние стандарты организации (СТО) "
  + "в области промышленной безопасности";

/** Виды аудита, определяющие необходимость СТО или выбора направлений. */
const KIND_TABS = [
  {
    id: "BASIC",
    label: "Базовый",
  },
  {
    id: "INTERIM",
    label: "Промежуточный",
  },
  {
    id: "SELECTIVE",
    label: "Выборочный",
  },
  {
    id: "CONSULTATION",
    label: "Консультация",
  },
];

/** Вид аудита, доступные направления и отдельное изменение документа СТО. */
interface AuditKindFieldsProps {
  value: AuditOrderDetails;
  onChange: (value: AuditOrderDetails) => void;
  onDocumentChange: (document: AuditOrderDocument | null) => void;
  areaOptions: OrderFieldOption[];
}

/** Показывает вид аудита, требования к СТО и направления выборочного аудита. */
export function AuditKindFields({
  value,
  onChange,
  onDocumentChange,
  areaOptions,
}: AuditKindFieldsProps) {
  const withStandards = value.audit_kind === "BASIC" || value.audit_kind === "INTERIM";

  /** Меняет вид аудита, сохраняя уже заполненные дополнительные поля. */
  function changeKind(kind: string) {
    if (
      kind !== "BASIC" &&
      kind !== "INTERIM" &&
      kind !== "SELECTIVE" &&
      kind !== "CONSULTATION"
    ) {
      return;
    }

    onChange({
      ...value,
      audit_kind: kind,
    });
  }

  /** Меняет необходимость учитывать внутренние стандарты организации. */
  function changeStandardsRequirement(isRequired: boolean) {
    onChange({
      ...value,
      considers_sto: isRequired,
    });
  }

  /** Меняет наименование и реквизиты СТО. */
  function changeStandardName(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      sto_name: event.target.value,
    });
  }

  /** Обновляет направления выборочного аудита. */
  function changeAreas(areas: string[]) {
    onChange({
      ...value,
      audit_areas: areas,
    });
  }

  return (
    <>
      <Field label="Тип аудита">
        <Tabs
          tabs={KIND_TABS}
          activeTab={value.audit_kind}
          onTabChange={changeKind}
          variant="squared"
        />
      </Field>
      {withStandards && (
        <Field label={STANDARDS_LABEL}>
          <YesNoField
            value={value.considers_sto}
            onChange={changeStandardsRequirement}
          />
          {value.considers_sto && (
            <TextInput
              value={value.sto_name}
              onChange={changeStandardName}
              placeholder="Наименование и реквизиты СТО"
            />
          )}
          {value.considers_sto && (
            <AuditOrderDocumentField
              label="Файл СТО"
              value={value.sto_file}
              onChange={onDocumentChange}
            />
          )}
        </Field>
      )}
      {value.audit_kind === "SELECTIVE" && (
        <Field label="Направления аудита по пункту 17 Приказа № 318">
          <MultiSelect
            id="audit-areas-p17"
            options={areaOptions}
            value={value.audit_areas}
            onChange={changeAreas}
          />
        </Field>
      )}
    </>
  );
}
