"use client";

import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { ApplicantFields, Field, FieldStack } from "../../shared";
import type { SurveyCatalogs } from "../catalogs/types";
import type { SurveyOrderDetails } from "./types";

interface SurveyOrderFieldsProps {
  value: SurveyOrderDetails;
  onChange: (value: SurveyOrderDetails) => void;
  catalogs: SurveyCatalogs;
}

/** Заявка на инженерные изыскания: заявитель и виды изысканий. */
export function SurveyOrderFields({ value, onChange, catalogs }: SurveyOrderFieldsProps) {
  const kindOptions = catalogs.kinds.map((option) => ({ code: option.code, title: `${option.short} — ${option.title}` }));

  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </Field>

      <Field label="Виды изысканий">
        <MultiSelect
          id="survey-order-kinds"
          options={kindOptions}
          value={value.kinds}
          onChange={(next) => onChange({ ...value, kinds: next })}
        />
      </Field>
    </FieldStack>
  );
}
