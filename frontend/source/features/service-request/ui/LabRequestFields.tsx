"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import type { ServiceRequestState } from "../model/types";
import { Field } from "./Field";
import s from "./service-request-form.module.scss";

interface Props {
  state: ServiceRequestState;
  onResearchNameChange: (value: string) => void;
  onEquipmentChange: (value: string) => void;
}

export function LabRequestFields({ state, onResearchNameChange, onEquipmentChange }: Props) {
  return (
    <>
      <Field label="Наименование исследований">
        <textarea
          className={s.textarea}
          value={state.researchName}
          required
          onChange={(e) => onResearchNameChange(e.target.value)}
          placeholder="Что требуется исследовать"
          rows={3}
        />
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
