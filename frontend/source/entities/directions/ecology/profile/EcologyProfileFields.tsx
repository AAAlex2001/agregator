"use client";

import { TextArea } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { Field, FieldStack } from "../../shared";
import type { EcologyCatalogs } from "../catalogs/types";
import type { EcologyProfile } from "./types";

interface EcologyProfileFieldsProps {
  value: EcologyProfile;
  onChange: (value: EcologyProfile) => void;
  catalogs: EcologyCatalogs;
}

/** Анкета эколога: виды работ и практические навыки. */
export function EcologyProfileFields({ value, onChange, catalogs }: EcologyProfileFieldsProps) {
  return (
    <FieldStack>
      <Field label="Какие виды работ вы выполняете">
        <MultiSelect
          id="ecology-work-types"
          options={catalogs.work_types}
          value={value.work_types}
          onChange={(next) => onChange({ ...value, work_types: next })}
        />
      </Field>

      <Field label="Практические навыки">
        <TextArea
          value={value.practical_skills}
          onChange={(event) => onChange({ ...value, practical_skills: event.target.value })}
          placeholder="Знание законодательства, работа с отчётными формами, расчёты платы за НВОС, взаимодействие с контролирующими органами"
          maxLength={5000}
        />
      </Field>
    </FieldStack>
  );
}
