"use client";

import { TextArea } from "@/source/shared/ui/Inputs";
import { ApplicantFields, Field, FieldStack } from "../../shared";
import type { LaboratoryOrderDetails } from "./types";

interface LaboratoryOrderFieldsProps {
  value: LaboratoryOrderDetails;
  onChange: (value: LaboratoryOrderDetails) => void;
}

/** Заявка на лабораторные исследования: заявитель и требования к оборудованию. */
export function LaboratoryOrderFields({ value, onChange }: LaboratoryOrderFieldsProps) {
  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </Field>

      <Field label="Требования к оборудованию">
        <TextArea
          value={value.equipment_requirements}
          onChange={(event) => onChange({ ...value, equipment_requirements: event.target.value })}
          placeholder="Тип оборудования, диапазон измерений, аккредитация"
          maxLength={5000}
        />
      </Field>
    </FieldStack>
  );
}
