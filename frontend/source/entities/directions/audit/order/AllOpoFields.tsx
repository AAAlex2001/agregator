"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { Cell, Field } from "../../shared";
import { AuditOrderFileField } from "./AuditOrderFileField";
import type { AuditBlockProps } from "./blockProps";
import s from "./AllOpoFields.module.scss";

const OPO_CLASSES = [
  { key: "opo_class_1", label: "I класс" },
  { key: "opo_class_2", label: "II класс" },
  { key: "opo_class_3", label: "III класс" },
  { key: "opo_class_4", label: "IV класс" },
] as const;

/** Число из поля ввода: только цифры, пустое поле — null. */
function parseCount(raw: string): number | null {
  const digits = raw.replace(/\D/g, "");
  return digits ? Number(digits) : null;
}

/** «Все ОПО организации»: сколько объектов, по каким классам, отрасль, регионы и свидетельство о регистрации. */
export function AllOpoFields({ value, onChange }: AuditBlockProps) {
  return (
    <>
      <Field label="Общее количество ОПО">
        <TextInput
          value={String(value.opo_total ?? "")}
          onChange={(event) => onChange({ ...value, opo_total: parseCount(event.target.value) })}
          placeholder="0"
          inputMode="numeric"
        />
      </Field>

      <Field label="Количество ОПО по классам опасности">
        <div className={s.classGrid}>
          {OPO_CLASSES.map((item) => (
            <Cell key={item.key} label={item.label}>
              <TextInput
                value={String(value[item.key] ?? "")}
                onChange={(event) => onChange({ ...value, [item.key]: parseCount(event.target.value) })}
                placeholder="0"
                inputMode="numeric"
              />
            </Cell>
          ))}
        </div>
      </Field>

      <Field label="Основной отраслевой профиль">
        <TextInput
          value={value.main_industry}
          onChange={(event) => onChange({ ...value, main_industry: event.target.value })}
          placeholder="Металлургия, газоснабжение, химия"
        />
      </Field>

      <Field label="ОПО расположены в разных субъектах РФ">
        <YesNoField value={value.multiple_regions} onChange={(next) => onChange({ ...value, multiple_regions: next })} />
      </Field>

      <AuditOrderFileField
        label="Свидетельство о регистрации ОПО"
        value={value.registration_certificate}
        onChange={(next) => onChange({ ...value, registration_certificate: next })}
      />
    </>
  );
}
