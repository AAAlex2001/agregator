"use client";

import type { ChangeEvent } from "react";
import { Cell } from "@/shared/ui/cell";
import { Field } from "@/shared/ui/field";
import { TextInput } from "@/shared/ui/text-input";
import { YesNoField } from "@/shared/ui/yes-no-field";
import type {
  AuditObjectCountKey,
  AuditOrderDetails,
  AuditOrderDocument,
} from "../../model/details/audit";
import { AuditObjectCountInput } from "../audit-object-count-input";
import { AuditOrderDocumentField } from "../audit-order-document-field";
import styles from "./style.module.scss";

/** Группы опасных производственных объектов по классу опасности. */
const OBJECT_CLASSES = [
  {
    field: "opo_class_1",
    label: "I класс",
  },
  {
    field: "opo_class_2",
    label: "II класс",
  },
  {
    field: "opo_class_3",
    label: "III класс",
  },
  {
    field: "opo_class_4",
    label: "IV класс",
  },
] as const;

/** Условия аудита всех ОПО и отдельное изменение свидетельства регистрации. */
interface AuditAllObjectsFieldsProps {
  value: AuditOrderDetails;
  onChange: (value: AuditOrderDetails) => void;
  onDocumentChange: (document: AuditOrderDocument | null) => void;
}

/** Показывает количество, классы, отрасль и регистрацию всех ОПО организации. */
export function AuditAllObjectsFields({
  value,
  onChange,
  onDocumentChange,
}: AuditAllObjectsFieldsProps) {
  /** Меняет количество объектов в выбранной группе. */
  function changeCount(field: AuditObjectCountKey, count: number | null) {
    onChange({
      ...value,
      [field]: count,
    });
  }

  /** Меняет основной отраслевой профиль организации. */
  function changeIndustry(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      main_industry: event.target.value,
    });
  }

  /** Указывает расположение ОПО в нескольких субъектах РФ. */
  function changeMultipleRegions(isMultiple: boolean) {
    onChange({
      ...value,
      multiple_regions: isMultiple,
    });
  }

  return (
    <>
      <Field label="Общее количество ОПО">
        <AuditObjectCountInput
          field="opo_total"
          value={value.opo_total}
          onChange={changeCount}
        />
      </Field>
      <Field label="Количество ОПО по классам опасности">
        <div className={styles.classGrid}>
          {OBJECT_CLASSES.map((item) => (
            <Cell
              key={item.field}
              label={item.label}
            >
              <AuditObjectCountInput
                field={item.field}
                value={value[item.field]}
                onChange={changeCount}
              />
            </Cell>
          ))}
        </div>
      </Field>
      <Field label="Основной отраслевой профиль">
        <TextInput
          value={value.main_industry}
          onChange={changeIndustry}
          placeholder="Металлургия, газоснабжение, химия"
        />
      </Field>
      <Field label="ОПО расположены в разных субъектах РФ">
        <YesNoField
          value={value.multiple_regions}
          onChange={changeMultipleRegions}
        />
      </Field>
      <AuditOrderDocumentField
        label="Свидетельство о регистрации ОПО"
        value={value.registration_certificate}
        onChange={onDocumentChange}
      />
    </>
  );
}
