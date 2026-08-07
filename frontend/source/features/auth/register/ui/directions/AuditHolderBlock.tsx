"use client";

import { useFormState, useWatch, type UseFormReturn } from "react-hook-form";
import { TextInput } from "@/source/shared/ui/Inputs";
import {
  emptyAuditLicenseHolderProfile,
  type AuditLicenseHolderProfile,
} from "@/source/features/directions/audit";
import type { RegisterFormValues } from "../../model/schema";
import { DirectionOption } from "./DirectionOption";
import s from "./DirectionsPicker.module.scss";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
}

export function AuditHolderBlock({ form }: Props) {
  const value = useWatch({ control: form.control, name: "auditLicenseHolderProfile" });
  const { errors } = useFormState({ control: form.control, name: "auditLicenseHolderProfile" });

  const change = (next: AuditLicenseHolderProfile | null) =>
    form.setValue("auditLicenseHolderProfile", next, { shouldValidate: form.formState.isSubmitted });

  return (
    <DirectionOption
      id="AUDIT_SUPB"
      title="Аудит СУПБ"
      description="Аккредитованный инспекционный орган — независимая третья сторона по аудиту СУПБ"
      checked={value !== null}
      error={errors.auditLicenseHolderProfile?.message}
      onToggle={() => change(value === null ? { ...emptyAuditLicenseHolderProfile } : null)}
    >
      {value !== null && (
        <>
          <TextInput
            value={value.certificate_number}
            onChange={(event) => change({ ...value, certificate_number: event.target.value })}
            placeholder="№ свидетельства об аккредитации"
          />
          <span className={s.itemText}>
            Области аккредитации по аудиту СУПБ укажете в личном кабинете.
          </span>
        </>
      )}
    </DirectionOption>
  );
}
