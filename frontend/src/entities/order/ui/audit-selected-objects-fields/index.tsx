"use client";

import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { createAuditOrderObject } from "../../model/create-order-details";
import type { AuditOrderDetails, AuditOrderObject } from "../../model/details/audit";
import { AuditObjectCard } from "../audit-object-card";
import styles from "./style.module.scss";

/** Выбранные для аудита объекты и изменение условий заказа. */
interface AuditSelectedObjectsFieldsProps {
  value: AuditOrderDetails;
  onChange: (value: AuditOrderDetails) => void;
}

/** Показывает список ОПО с добавлением и удалением дополнительных объектов. */
export function AuditSelectedObjectsFields({
  value,
  onChange,
}: AuditSelectedObjectsFieldsProps) {
  /** Обновляет выбранный объект, сохраняя порядок остальных. */
  function changeObject(previous: AuditOrderObject, next: AuditOrderObject) {
    onChange({
      ...value,
      opo_items: value.opo_items.map((item) => item === previous ? next : item),
    });
  }

  /** Убирает выбранный объект из условий аудита. */
  function removeObject(object: AuditOrderObject) {
    onChange({
      ...value,
      opo_items: value.opo_items.filter((item) => item !== object),
    });
  }

  /** Добавляет незаполненную карточку следующего объекта. */
  function addObject() {
    onChange({
      ...value,
      opo_items: [...value.opo_items, createAuditOrderObject()],
    });
  }

  return (
    <Field label="Объекты для аудита">
      {value.opo_items.map((item, index) => (
        <AuditObjectCard
          key={index}
          number={index + 1}
          value={item}
          canRemove={value.opo_items.length > 1}
          onChange={changeObject}
          onRemove={removeObject}
        />
      ))}
      <Button
        type="button"
        variant="transparent"
        size="sm"
        className={styles.add}
        onClick={addObject}
      >
        + Добавить объект
      </Button>
    </Field>
  );
}
