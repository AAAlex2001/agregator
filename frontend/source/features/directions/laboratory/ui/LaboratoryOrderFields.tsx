"use client";

import { TextArea } from "@/source/shared/ui/Inputs";
import type { LaboratoryOrderDetails } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: LaboratoryOrderDetails;
  onChange: (value: LaboratoryOrderDetails) => void;
}

export function LaboratoryOrderFields({ value, onChange }: Props) {
  return (
    <div className={s.form}>
      <label className={s.field}>
        <span className={s.label}>Требования к оборудованию</span>
        <TextArea
          value={value.equipment_requirements}
          onChange={(event) => onChange({ ...value, equipment_requirements: event.target.value })}
          placeholder="Тип оборудования, диапазон измерений, аккредитация"
          maxLength={5000}
        />
      </label>
    </div>
  );
}
