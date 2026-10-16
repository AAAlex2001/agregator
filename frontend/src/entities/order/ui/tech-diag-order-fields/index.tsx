"use client";

import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { TextArea } from "@/shared/ui/text-area";
import { TextInput } from "@/shared/ui/text-input";
import type { OrderApplicant } from "../../model/details/applicant";
import type { TechDiagOrderDetails } from "../../model/details/tech-diag";
import { OrderApplicantFields } from "../order-applicant-fields";

/** Условия технического диагностирования и их изменение в форме заказа. */
interface TechDiagOrderFieldsProps {
  value: TechDiagOrderDetails;
  onChange: (value: TechDiagOrderDetails) => void;
}

/** Показывает заявителя, цель, местоположение и срок диагностирования. */
export function TechDiagOrderFields({ value, onChange }: TechDiagOrderFieldsProps) {
  /** Обновляет сведения о заявителе, сохраняя условия работ. */
  function changeApplicant(applicant: OrderApplicant) {
    onChange({
      ...value,
      ...applicant,
    });
  }

  /** Обновляет цель диагностирования. */
  function changePurpose(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      purpose: event.target.value,
    });
  }

  /** Обновляет город нахождения объекта. */
  function changeCity(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      object_city: event.target.value,
    });
  }

  /** Обновляет срок проведения работ. */
  function changeDuration(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      duration: event.target.value,
    });
  }

  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <OrderApplicantFields
          value={value}
          onChange={changeApplicant}
        />
      </Field>
      <Field label="Цель проведения работ">
        <TextArea
          value={value.purpose}
          onChange={changePurpose}
          placeholder="Что нужно освидетельствовать или продиагностировать и зачем"
          maxLength={5000}
        />
      </Field>
      <Field label="Где находится объект">
        <TextInput
          value={value.object_city}
          onChange={changeCity}
          placeholder="Город"
        />
      </Field>
      <Field label="Срок проведения">
        <TextInput
          value={value.duration}
          onChange={changeDuration}
          placeholder="Например: 2 недели"
        />
      </Field>
    </FieldStack>
  );
}
