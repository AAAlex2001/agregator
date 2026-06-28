"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { TextInput } from "@/source/shared/ui/Inputs";
import type { HazardFactor, HazardOption } from "@/source/entities/hazard";
import s from "./FactorEditorModal.module.scss";

interface Props {
  factor: HazardFactor;
  onSave: (factor: HazardFactor) => void;
  onDelete: (factor: HazardFactor) => void;
  onClose: () => void;
}

export function FactorEditorModal({ factor, onSave, onDelete, onClose }: Props) {
  const [name, setName] = useState(factor.name);
  const [options, setOptions] = useState<HazardOption[]>(factor.options);

  const setOption = (index: number, patch: Partial<HazardOption>) =>
    setOptions((prev) => prev.map((option, i) => (i === index ? { ...option, ...patch } : option)));
  const addOption = () => setOptions((prev) => [...prev, { value: 0, label: "Вариант (0,00)" }]);
  const removeOption = (index: number) => setOptions((prev) => prev.filter((_, i) => i !== index));

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
              <input
                className={s.value}
                type="number"
                step="0.01"
                value={option.value ?? ""}
                placeholder="—"
                onChange={(e) => setOption(index, { value: e.target.value === "" ? null : Number(e.target.value) })}
              />
              <TextInput
                value={option.label}
                onChange={(e) => setOption(index, { label: e.target.value })}
                placeholder="Подпись варианта"
                className={s.optLabel}
              />
              <button className={s.remove} onClick={() => removeOption(index)} aria-label="Удалить вариант">
                ×
              </button>
            </div>
          ))}
        </div>
        <button className={s.addOption} onClick={addOption}>
          + Добавить вариант
        </button>

        <div className={s.actions}>
          <Button variant="danger" onClick={() => onDelete(factor)}>
            Удалить фактор
          </Button>
          <div className={s.spacer} />
          <Button variant="outlineOrange" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={() => onSave({ ...factor, name, options })}>
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
}
