"use client";

import Tabs from "@/source/shared/ui/Tabs";
import { Field } from "../../shared";
import { emptyAuditOpoItem, type AuditScale } from "./types";
import { OpoItemFields } from "./OpoItemFields";
import { AllOpoFields } from "./AllOpoFields";
import { SelectedOpoFields } from "./SelectedOpoFields";
import type { AuditBlockProps } from "./blockProps";

const SCALE_TABS = [
  { id: "SINGLE_OPO", label: "Один ОПО" },
  { id: "ALL_OPO", label: "Все ОПО организации" },
  { id: "SELECTED_OPO", label: "Выборочные ОПО" },
];

/** Что аудировать: один объект, все объекты организации или выбранные. При смене сохраняем уже введённые объекты. */
export function AuditScaleFields({ value, onChange }: AuditBlockProps) {
  const first = value.opo_items[0] ?? { ...emptyAuditOpoItem };

  const changeScale = (scale: AuditScale) => {
    if (scale === "ALL_OPO") onChange({ ...value, audit_scale: scale, opo_items: [] });
    if (scale === "SINGLE_OPO") onChange({ ...value, audit_scale: scale, opo_items: [first] });
    if (scale === "SELECTED_OPO") onChange({ ...value, audit_scale: scale, opo_items: value.opo_items.length ? value.opo_items : [first] });
  };

  return (
    <>
      <Field label="Что нужно аудировать">
        <Tabs tabs={SCALE_TABS} activeTab={value.audit_scale} onTabChange={(id) => changeScale(id as AuditScale)} variant="squared" />
      </Field>

      {value.audit_scale === "SINGLE_OPO" && (
        <Field label="Сведения об объекте">
          <OpoItemFields value={first} onChange={(item) => onChange({ ...value, opo_items: [item] })} />
        </Field>
      )}
      {value.audit_scale === "ALL_OPO" && <AllOpoFields value={value} onChange={onChange} />}
      {value.audit_scale === "SELECTED_OPO" && <SelectedOpoFields value={value} onChange={onChange} />}
    </>
  );
}
