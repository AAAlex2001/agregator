"use client";

import { Field } from "@/shared/ui/field";
import { Tabs } from "@/shared/ui/tabs";
import { createAuditOrderObject } from "../../model/create-order-details";
import type {
  AuditOrderDetails,
  AuditOrderDocument,
  AuditOrderObject,
} from "../../model/details/audit";
import { AuditAllObjectsFields } from "../audit-all-objects-fields";
import { AuditObjectFields } from "../audit-object-fields";
import { AuditSelectedObjectsFields } from "../audit-selected-objects-fields";

/** Варианты охвата опасных производственных объектов аудитом. */
const SCALE_TABS = [
  {
    id: "SINGLE_OPO",
    label: "Один ОПО",
  },
  {
    id: "ALL_OPO",
    label: "Все ОПО организации",
  },
  {
    id: "SELECTED_OPO",
    label: "Выборочные ОПО",
  },
];

/** Масштаб аудита, объекты и действие изменения свидетельства регистрации. */
interface AuditScaleFieldsProps {
  value: AuditOrderDetails;
  onChange: (value: AuditOrderDetails) => void;
  onDocumentChange: (document: AuditOrderDocument | null) => void;
}

/** Выбирает охват аудита и показывает соответствующие поля объектов. */
export function AuditScaleFields({
  value,
  onChange,
  onDocumentChange,
}: AuditScaleFieldsProps) {
  const firstObject = value.opo_items[0] ?? createAuditOrderObject();

  /** При смене охвата сохраняет первый объект или очищает список для всех ОПО. */
  function changeScale(scale: string) {
    switch (scale) {
      case "ALL_OPO":
        onChange({
          ...value,
          audit_scale: scale,
          opo_items: [],
        });
        break;
      case "SINGLE_OPO":
        onChange({
          ...value,
          audit_scale: scale,
          opo_items: [firstObject],
        });
        break;
      case "SELECTED_OPO":
        onChange({
          ...value,
          audit_scale: scale,
          opo_items: value.opo_items.length > 0
            ? value.opo_items
            : [firstObject],
        });
        break;
    }
  }

  /** Обновляет единственный объект аудита. */
  function changeSingleObject(object: AuditOrderObject) {
    onChange({
      ...value,
      opo_items: [object],
    });
  }

  return (
    <>
      <Field label="Что нужно аудировать">
        <Tabs
          tabs={SCALE_TABS}
          activeTab={value.audit_scale}
          onTabChange={changeScale}
          variant="squared"
        />
      </Field>
      {value.audit_scale === "SINGLE_OPO" && (
        <Field label="Сведения об объекте">
          <AuditObjectFields
            value={firstObject}
            onChange={changeSingleObject}
          />
        </Field>
      )}
      {value.audit_scale === "ALL_OPO" && (
        <AuditAllObjectsFields
          value={value}
          onChange={onChange}
          onDocumentChange={onDocumentChange}
        />
      )}
      {value.audit_scale === "SELECTED_OPO" && (
        <AuditSelectedObjectsFields
          value={value}
          onChange={onChange}
        />
      )}
    </>
  );
}
