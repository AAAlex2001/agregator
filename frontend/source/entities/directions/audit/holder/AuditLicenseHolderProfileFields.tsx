"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { Field, FieldStack } from "../../shared";
import type { AuditCatalogs } from "../catalogs/types";
import type { AuditLicenseHolderProfile } from "./types";

interface AuditLicenseHolderProfileFieldsProps {
  value: AuditLicenseHolderProfile;
  onChange: (value: AuditLicenseHolderProfile) => void;
  catalogs: AuditCatalogs;
}

/** Анкета инспекционного органа: номер свидетельства и области аккредитации. */
export function AuditLicenseHolderProfileFields({ value, onChange, catalogs }: AuditLicenseHolderProfileFieldsProps) {
  return (
    <FieldStack>
      <Field label="№ свидетельства об аккредитации">
        <TextInput
          value={value.certificate_number}
          onChange={(event) => onChange({ ...value, certificate_number: event.target.value })}
          placeholder="RA.RU.010001"
        />
      </Field>
      <Field label="Области аккредитации по аудиту СУПБ">
        <MultiSelect
          id="audit-holder-accreditation"
          options={catalogs.accreditation_areas}
          value={value.accreditation_areas}
          onChange={(next) => onChange({ ...value, accreditation_areas: next })}
        />
      </Field>
    </FieldStack>
  );
}
