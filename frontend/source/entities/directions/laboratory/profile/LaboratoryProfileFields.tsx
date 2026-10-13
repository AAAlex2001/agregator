"use client";

import { TextArea } from "@/source/shared/ui/Inputs";
import { Field, FieldStack } from "../../shared";
import type { LaboratoryProfile } from "./types";

interface LaboratoryProfileFieldsProps {
  value: LaboratoryProfile;
  onChange: (value: LaboratoryProfile) => void;
}

/** Анкета лаборатории: область аккредитации и комментарий. */
export function LaboratoryProfileFields({ value, onChange }: LaboratoryProfileFieldsProps) {
  return (
    <FieldStack>
      <Field label="Область аккредитации лаборатории">
        <TextArea
          value={value.accreditation_area}
          onChange={(event) => onChange({ ...value, accreditation_area: event.target.value })}
          placeholder="Виды исследований и испытаний из области аккредитации"
          maxLength={5000}
        />
      </Field>

      <Field label="Комментарий">
        <TextArea
          value={value.comment}
          onChange={(event) => onChange({ ...value, comment: event.target.value })}
          placeholder="Дополнительные сведения о лаборатории"
          maxLength={5000}
        />
      </Field>
    </FieldStack>
  );
}
