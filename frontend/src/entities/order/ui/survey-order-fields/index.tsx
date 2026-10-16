"use client";

import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { MultiSelect } from "@/shared/ui/multi-select";
import type { OrderApplicant } from "../../model/details/applicant";
import type { SurveyOrderDetails } from "../../model/details/survey";
import type { OrderFieldOption } from "../../model/order-field-option";
import { OrderApplicantFields } from "../order-applicant-fields";

/** Условия инженерных изысканий и варианты с коротким шифром в подписи. */
interface SurveyOrderFieldsProps {
  value: SurveyOrderDetails;
  onChange: (value: SurveyOrderDetails) => void;
  kindOptions: OrderFieldOption[];
}

/** Показывает сведения о заявителе и выбор видов инженерных изысканий. */
export function SurveyOrderFields({
  value,
  onChange,
  kindOptions,
}: SurveyOrderFieldsProps) {
  /** Обновляет сведения о заявителе, сохраняя выбранные изыскания. */
  function changeApplicant(applicant: OrderApplicant) {
    onChange({
      ...value,
      ...applicant,
    });
  }

  /** Обновляет коды необходимых видов изысканий. */
  function changeKinds(kinds: string[]) {
    onChange({
      ...value,
      kinds,
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
      <Field label="Виды изысканий">
        <MultiSelect
          id="survey-order-kinds"
          options={kindOptions}
          value={value.kinds}
          onChange={changeKinds}
        />
      </Field>
    </FieldStack>
  );
}
