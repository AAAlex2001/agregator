"use client";

import { useFormState, useWatch, type UseFormReturn } from "react-hook-form";
import {
  emptyLaboratoryProfile,
  LaboratoryProfileFields,
  type LaboratoryProfile,
} from "@/source/features/directions/laboratory";
import type { RegisterFormValues } from "../../model/schema";
import { DirectionOption } from "./DirectionOption";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
}

export function LaboratoryBlock({ form }: Props) {
  const value = useWatch({ control: form.control, name: "laboratoryProfile" });
  const { errors } = useFormState({ control: form.control, name: "laboratoryProfile" });

  const change = (next: LaboratoryProfile | null) =>
    form.setValue("laboratoryProfile", next, { shouldValidate: form.formState.isSubmitted });

  return (
    <DirectionOption
      id="LABORATORY"
      title="Лабораторные исследования"
      description="Область аккредитации лаборатории и дополнительные сведения"
      checked={value !== null}
      error={errors.laboratoryProfile?.message}
      onToggle={() => change(value === null ? { ...emptyLaboratoryProfile } : null)}
    >
      {value !== null && <LaboratoryProfileFields value={value} onChange={change} />}
    </DirectionOption>
  );
}
