"use client";

import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { TextArea } from "@/shared/ui/text-area";
import type { OrderApplicant } from "../../model/details/applicant";
import type { LaboratoryOrderDetails } from "../../model/details/laboratory";
import { OrderApplicantFields } from "../order-applicant-fields";

/** Условия лабораторных исследований и их изменение в форме заказа. */
interface LaboratoryOrderFieldsProps {
  value: LaboratoryOrderDetails;
  onChange: (value: LaboratoryOrderDetails) => void;
}

/** Показывает заявителя и требования к лабораторному оборудованию. */
export function LaboratoryOrderFields({
  value,
  onChange,
}: LaboratoryOrderFieldsProps) {
  /** Обновляет сведения о заявителе, сохраняя требования к оборудованию. */
  function changeApplicant(applicant: OrderApplicant) {
    onChange({
      ...value,
      ...applicant,
    });
  }

  /** Обновляет требования к оборудованию лаборатории. */
  function changeEquipmentRequirements(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      equipment_requirements: event.target.value,
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
      <Field label="Требования к оборудованию">
        <TextArea
          value={value.equipment_requirements}
          onChange={changeEquipmentRequirements}
          placeholder="Тип оборудования, диапазон измерений, аккредитация"
          maxLength={5000}
        />
      </Field>
    </FieldStack>
  );
}
