"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { Field, FieldStack } from "../../shared";
import type { TechDiagCatalogs } from "../catalogs/types";
import type { TechDiagHolderProfile } from "./types";

interface TechDiagHolderProfileFieldsProps {
  value: TechDiagHolderProfile;
  onChange: (value: TechDiagHolderProfile) => void;
  catalogs: TechDiagCatalogs;
}

/** Анкета лаборатории НК: виды контроля и город организации. */
export function TechDiagHolderProfileFields({ value, onChange, catalogs }: TechDiagHolderProfileFieldsProps) {
  return (
    <FieldStack>
      <Field label="Виды неразрушающего контроля">
        <MultiSelect
          id="tech-diag-holder-methods"
          options={catalogs.methods}
          value={value.methods}
          onChange={(next) => onChange({ ...value, methods: next })}
        />
      </Field>

      <Field label="Где находится организация">
        <TextInput
          value={value.organization_city}
          onChange={(event) => onChange({ ...value, organization_city: event.target.value })}
          placeholder="Город"
        />
      </Field>
    </FieldStack>
  );
}
