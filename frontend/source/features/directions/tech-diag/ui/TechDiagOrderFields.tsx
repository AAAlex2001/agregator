"use client";

import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import type { TechDiagOrderDetails } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: TechDiagOrderDetails;
  onChange: (value: TechDiagOrderDetails) => void;
}

export function TechDiagOrderFields({ value, onChange }: Props) {
  return (
    <div className={s.form}>
      <label className={s.field}>
        <span className={s.label}>Цель проведения работ</span>
        <TextArea
          value={value.purpose}
          onChange={(event) => onChange({ ...value, purpose: event.target.value })}
          placeholder="Что нужно освидетельствовать или продиагностировать и зачем"
          maxLength={5000}
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Где находится объект</span>
        <TextInput
          value={value.object_city}
          onChange={(event) => onChange({ ...value, object_city: event.target.value })}
          placeholder="Город"
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Срок проведения</span>
        <TextInput
          value={value.duration}
          onChange={(event) => onChange({ ...value, duration: event.target.value })}
          placeholder="Например: 2 недели"
        />
      </label>
    </div>
  );
}
