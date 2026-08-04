"use client";

import { useFormState, useWatch, type UseFormReturn } from "react-hook-form";
import {
  emptyExpertiseProfile,
  ExpertiseProfileFields,
  type ExpertiseProfile,
} from "@/source/features/directions/expertise";
import type { RegisterFormValues } from "../../model/schema";
import { DirectionOption } from "./DirectionOption";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
}

export function ExpertiseBlock({ form }: Props) {
  const value = useWatch({ control: form.control, name: "expertiseProfile" });
  const { errors } = useFormState({ control: form.control, name: "expertiseProfile" });

  const change = (next: ExpertiseProfile | null) =>
    form.setValue("expertiseProfile", next, { shouldValidate: form.formState.isSubmitted });

  return (
    <DirectionOption
      id="EXPERTISE"
      title="Экспертиза промышленной безопасности"
      description="Удостоверения: область аттестации, объект экспертизы и категория"
      checked={value !== null}
      error={errors.expertiseProfile?.message}
      onToggle={() => change(value === null ? { ...emptyExpertiseProfile } : null)}
    >
      {value !== null && <ExpertiseProfileFields value={value} onChange={change} />}
    </DirectionOption>
  );
}
