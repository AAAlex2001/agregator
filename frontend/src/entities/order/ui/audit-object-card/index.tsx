"use client";

import { RemoveButton } from "@/shared/ui/remove-button";
import type { AuditOrderObject } from "../../model/details/audit";
import { AuditObjectFields } from "../audit-object-fields";
import styles from "./style.module.scss";

/** Номер объекта, его поля и действия в списке выборочного аудита. */
interface AuditObjectCardProps {
  number: number;
  value: AuditOrderObject;
  canRemove: boolean;
  onChange: (previous: AuditOrderObject, next: AuditOrderObject) => void;
  onRemove: (value: AuditOrderObject) => void;
}

/** Показывает карточку ОПО и удаление дополнительного объекта из списка. */
export function AuditObjectCard({
  number,
  value,
  canRemove,
  onChange,
  onRemove,
}: AuditObjectCardProps) {
  /** Передаёт изменённый объект вместе с исходным элементом списка. */
  function changeObject(next: AuditOrderObject) {
    onChange(value, next);
  }

  /** Убирает этот объект из списка аудита. */
  function removeObject() {
    onRemove(value);
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.title}>ОПО №{number}</span>
        {canRemove && (
          <RemoveButton
            label="Убрать объект"
            onClick={removeObject}
          />
        )}
      </div>
      <AuditObjectFields
        value={value}
        onChange={changeObject}
      />
    </div>
  );
}
