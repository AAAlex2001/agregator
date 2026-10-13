"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import { Field, FieldStack } from "../../shared";
import type { AuditCustomerProfile } from "./types";

interface AuditCustomerProfileFieldsProps {
  value: AuditCustomerProfile;
  onChange: (value: AuditCustomerProfile) => void;
}

/** Анкета заказчика аудита СУПБ: должность представителя и лицензия на ОПО. */
export function AuditCustomerProfileFields({ value, onChange }: AuditCustomerProfileFieldsProps) {
  return (
    <FieldStack>
      <Field label="Должность представителя">
        <TextInput
          value={value.position}
          onChange={(event) => onChange({ ...value, position: event.target.value })}
          placeholder="Главный инженер"
        />
      </Field>
      <Field label="Лицензия на эксплуатацию ОПО (при наличии)">
        <TextInput
          value={value.opo_license_number}
          onChange={(event) => onChange({ ...value, opo_license_number: event.target.value })}
          placeholder="Номер лицензии"
        />
      </Field>
    </FieldStack>
  );
}
