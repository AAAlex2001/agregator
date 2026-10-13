"use client";

import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { ApplicantFields, Field, FieldStack } from "../../shared";
import type { TechDiagOrderDetails } from "./types";

interface TechDiagOrderFieldsProps {
  value: TechDiagOrderDetails;
  onChange: (value: TechDiagOrderDetails) => void;
}

/** Заявка на техническое диагностирование: заявитель, цель, объект и срок. */
export function TechDiagOrderFields({ value, onChange }: TechDiagOrderFieldsProps) {
  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </Field>

      <Field label="Цель проведения работ">
        <TextArea
          value={value.purpose}
          onChange={(event) => onChange({ ...value, purpose: event.target.value })}
          placeholder="Что нужно освидетельствовать или продиагностировать и зачем"
          maxLength={5000}
        />
      </Field>

      <Field label="Где находится объект">
        <TextInput
          value={value.object_city}
          onChange={(event) => onChange({ ...value, object_city: event.target.value })}
          placeholder="Город"
        />
      </Field>

      <Field label="Срок проведения">
        <TextInput
          value={value.duration}
          onChange={(event) => onChange({ ...value, duration: event.target.value })}
          placeholder="Например: 2 недели"
        />
      </Field>
    </FieldStack>
  );
}
