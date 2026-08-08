"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import type { ServiceRequestErrors, ServiceRequestState } from "../model/types";
import { Field } from "./Field";
import s from "./service-request-form.module.scss";

interface Props {
  state: ServiceRequestState;
  errors: ServiceRequestErrors;
  onResearchNameChange: (value: string) => void;
  onEquipmentChange: (value: string) => void;
}

export function LabRequestFields({
  state,
  errors,
  onResearchNameChange,
  onEquipmentChange,
}: Props) {
  return (
    <>
      <Field label="Наименование исследований">
        <textarea
          className={errors.researchName ? `${s.textarea} ${s.textareaError}` : s.textarea}
          value={state.researchName}
          onChange={(e) => onResearchNameChange(e.target.value)}
          placeholder="Что требуется исследовать"
          rows={3}
        />
        {errors.researchName && <span className={s.error}>{errors.researchName}</span>}
      </Field>
      <Field label="Требования к оборудованию">
        <TextInput
          value={state.equipmentRequirements}
          onChange={(e) => onEquipmentChange(e.target.value)}
          placeholder="Необходимое оборудование, методики"
        />
      </Field>
    </>
  );
}
