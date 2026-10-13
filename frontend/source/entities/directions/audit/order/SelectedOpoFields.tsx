"use client";

import Button from "@/source/shared/ui/Button";
import { Field } from "../../shared";
import { emptyAuditOpoItem } from "./types";
import { OpoCard } from "./OpoCard";
import type { AuditBlockProps } from "./blockProps";
import s from "./SelectedOpoFields.module.scss";

/** «Выборочные ОПО»: список объектов с добавлением и удалением; хотя бы один объект остаётся всегда. */
export function SelectedOpoFields({ value, onChange }: AuditBlockProps) {
  const items = value.opo_items;

  return (
    <Field label="Объекты для аудита">
      {items.map((item, index) => (
        <OpoCard
          key={index}
          number={index + 1}
          value={item}
          canRemove={items.length > 1}
          onChange={(next) => onChange({ ...value, opo_items: items.map((other) => (other === item ? next : other)) })}
          onRemove={() => onChange({ ...value, opo_items: items.filter((other) => other !== item) })}
        />
      ))}
      <Button
        type="button"
        variant="transparent"
        size="sm"
        className={s.add}
        onClick={() => onChange({ ...value, opo_items: [...items, { ...emptyAuditOpoItem }] })}
      >
        + Добавить объект
      </Button>
    </Field>
  );
}
