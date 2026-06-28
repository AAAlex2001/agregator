"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { TextInput } from "@/source/shared/ui/Inputs";
import type { HazardFactor } from "@/source/entities/hazard";
import s from "./FactorEditorModal.module.scss";

interface EditOption {
  value: string;
  label: string;
}

interface Props {
  factor: HazardFactor;
  onSave: (factor: HazardFactor) => void;
  onDelete: (factor: HazardFactor) => void;
  onClose: () => void;
}

export function FactorEditorModal({ factor, onSave, onDelete, onClose }: Props) {
  const [name, setName] = useState(factor.name);
  const [options, setOptions] = useState<EditOption[]>(
    factor.options.map((option) => ({
      value: option.value === null ? "" : String(option.value).replace(".", ","),
      label: option.label,
    })),
  );

  const setOption = (index: number, patch: Partial<EditOption>) =>
    setOptions((prev) => prev.map((option, i) => (i === index ? { ...option, ...patch } : option)));
  const addOption = () => setOptions((prev) => [...prev, { value: "0", label: "Вариант (0,00)" }]);
  const removeOption = (index: number) => setOptions((prev) => prev.filter((_, i) => i !== index));

  const save = () =>
    onSave({
      ...factor,
      name,
      options: options.map((option) => {
        const raw = option.value.replace(",", ".").trim();
        const numeric = raw === "" ? null : Number(raw);
        return { value: raw === "" || Number.isNaN(numeric) ? null : numeric, label: option.label };
      }),
    });

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(event) => event.stopPropagation()}>
        <h3 className={s.title}>Фактор {factor.code}</h3>

        <label className={s.field}>
          <span className={s.label}>Название фактора</span>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Название" />
        </label>

        <span className={s.label}>Варианты ответа (балл · подпись)</span>
        <div className={s.options}>
          {options.map((option, index) => (
            <div key={index} className={s.optionRow}>
              <TextInput
                className={s.value}
                value={option.value}
                inputMode="decimal"
                placeholder="—"
                onChange={(e) => setOption(index, { value: e.target.value.replace(/[^\d.,]/g, "") })}
              />
              <TextInput
                className={s.optLabel}
                value={option.label}
                placeholder="Подпись варианта"
                onChange={(e) => setOption(index, { label: e.target.value })}
              />
              <Button variant="danger" size="sm" className={s.remove} onClick={() => removeOption(index)}>
                ×
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outlineOrange" size="sm" className={s.addOption} onClick={addOption}>
          + Добавить вариант
        </Button>

        <div className={s.actions}>
          <Button variant="danger" onClick={() => onDelete(factor)}>
            Удалить фактор
          </Button>
          <div className={s.spacer} />
          <Button variant="outlineOrange" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={save}>
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
}
