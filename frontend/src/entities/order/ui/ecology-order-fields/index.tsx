"use client";

import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { MultiSelect } from "@/shared/ui/multi-select";
import type { OrderApplicant } from "../../model/details/applicant";
import type { EcologyOrderDetails } from "../../model/details/ecology";
import type { OrderFieldOption } from "../../model/order-field-option";
import { OrderApplicantFields } from "../order-applicant-fields";

/** Условия экологического сопровождения и доступные виды работ. */
interface EcologyOrderFieldsProps {
  value: EcologyOrderDetails;
  onChange: (value: EcologyOrderDetails) => void;
  workTypeOptions: OrderFieldOption[];
}

/** Показывает сведения о заявителе и выбор экологических работ. */
export function EcologyOrderFields({
  value,
  onChange,
  workTypeOptions,
}: EcologyOrderFieldsProps) {
  /** Обновляет сведения о заявителе, сохраняя выбранные работы. */
  function changeApplicant(applicant: OrderApplicant) {
    onChange({
      ...value,
      ...applicant,
    });
  }

  /** Обновляет коды необходимых экологических работ. */
  function changeWorkTypes(workTypes: string[]) {
    onChange({
      ...value,
      work_types: workTypes,
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
      <Field label="Какие работы нужны">
        <MultiSelect
          id="ecology-order-work-types"
          options={workTypeOptions}
          value={value.work_types}
          onChange={changeWorkTypes}
        />
      </Field>
    </FieldStack>
  );
}
