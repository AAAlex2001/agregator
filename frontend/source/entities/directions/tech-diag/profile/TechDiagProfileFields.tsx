"use client";

import { TextArea } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { Field, FieldStack } from "../../shared";
import type { TechDiagCatalogs } from "../catalogs/types";
import type { TechDiagProfile } from "./types";

interface TechDiagProfileFieldsProps {
  value: TechDiagProfile;
  onChange: (value: TechDiagProfile) => void;
  catalogs: TechDiagCatalogs;
}

/** Анкета специалиста НК: удостоверения, виды контроля и объекты по СДАНК-02-2020. */
export function TechDiagProfileFields({ value, onChange, catalogs }: TechDiagProfileFieldsProps) {
  return (
    <FieldStack>
      <Field label="Квалификационные удостоверения">
        <TextArea
          value={value.qualification_certificates}
          onChange={(event) => onChange({ ...value, qualification_certificates: event.target.value })}
          placeholder="Номера удостоверений, уровни квалификации и методы контроля"
          maxLength={5000}
        />
      </Field>

      <Field label="Виды неразрушающего контроля">
        <MultiSelect
          id="tech-diag-methods"
          options={catalogs.methods}
          value={value.methods}
          onChange={(next) => onChange({ ...value, methods: next })}
        />
      </Field>

      <Field label="Объекты контроля согласно СДАНК-02-2020">
        <MultiSelect
          id="tech-diag-objects"
          options={catalogs.control_objects}
          value={value.control_objects}
          onChange={(next) => onChange({ ...value, control_objects: next })}
        />
      </Field>
    </FieldStack>
  );
}
