"use client";

import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { ApplicantFields, Field, FieldStack } from "../../shared";
import type { EcologyCatalogs } from "../catalogs/types";
import type { EcologyOrderDetails } from "./types";

interface EcologyOrderFieldsProps {
  value: EcologyOrderDetails;
  onChange: (value: EcologyOrderDetails) => void;
  catalogs: EcologyCatalogs;
}

/** Заявка на экологическое сопровождение: заявитель и виды работ. */
export function EcologyOrderFields({ value, onChange, catalogs }: EcologyOrderFieldsProps) {
  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </Field>

      <Field label="Какие работы нужны">
        <MultiSelect
          id="ecology-order-work-types"
          options={catalogs.work_types}
          value={value.work_types}
          onChange={(next) => onChange({ ...value, work_types: next })}
        />
      </Field>
    </FieldStack>
  );
}
