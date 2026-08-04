"use client";

import { useFormState, useWatch, type UseFormReturn } from "react-hook-form";
import {
  AuditCustomerProfileFields,
  emptyAuditCustomerProfile,
  type AuditCustomerProfile,
} from "@/source/features/directions/audit";
import type { RegisterFormValues } from "../../model/schema";
import { DirectionOption } from "./DirectionOption";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
}

export function AuditCustomerBlock({ form }: Props) {
  const value = useWatch({ control: form.control, name: "auditCustomerProfile" });
  const { errors } = useFormState({ control: form.control, name: "auditCustomerProfile" });

  const change = (next: AuditCustomerProfile | null) =>
    form.setValue("auditCustomerProfile", next, { shouldValidate: form.formState.isSubmitted });

  return (
    <DirectionOption
      id="AUDIT_SUPB"
      title="Аудит СУПБ"
      description="Независимая оценка системы управления промышленной безопасностью"
      checked={value !== null}
      error={errors.auditCustomerProfile?.message}
      onToggle={() => change(value === null ? { ...emptyAuditCustomerProfile } : null)}
    >
      {value !== null && <AuditCustomerProfileFields value={value} onChange={change} />}
    </DirectionOption>
  );
}
