"use client";

import type { ChangeEvent } from "react";
import { TextInput } from "@/shared/ui/text-input";
import type { AuditObjectCountKey } from "../../model/details/audit";

/** Количество объектов в выбранной группе; пустой ввод хранится как null. */
interface AuditObjectCountInputProps {
  field: AuditObjectCountKey;
  value: number | null;
  onChange: (field: AuditObjectCountKey, count: number | null) => void;
}

/** Оставляет в количестве ОПО только цифры и разрешает очистить поле. */
export function AuditObjectCountInput({
  field,
  value,
  onChange,
}: AuditObjectCountInputProps) {
  /** Передаёт числовое количество объектов или отсутствие значения. */
  function changeCount(event: ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "");
    onChange(field, digits ? Number(digits) : null);
  }

  return (
    <TextInput
      value={String(value ?? "")}
      onChange={changeCount}
      placeholder="0"
      inputMode="numeric"
    />
  );
}
