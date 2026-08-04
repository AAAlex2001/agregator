"use client";

import { useFormState, useWatch, type UseFormReturn } from "react-hook-form";
import {
  emptyResearchProfile,
  ResearchProfileFields,
  type ResearchProfile,
} from "@/source/features/directions/research";
import type { RegisterFormValues } from "../../model/schema";
import { DirectionOption } from "./DirectionOption";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
}

export function ResearchBlock({ form }: Props) {
  const value = useWatch({ control: form.control, name: "researchProfile" });
  const { errors } = useFormState({ control: form.control, name: "researchProfile" });

  const change = (next: ResearchProfile | null) =>
    form.setValue("researchProfile", next, { shouldValidate: form.formState.isSubmitted });

  return (
    <DirectionOption
      id="RESEARCH"
      title="Научно-исследовательские работы"
      description="Учёная степень, звание и направление научной деятельности"
      checked={value !== null}
      error={errors.researchProfile?.message}
      onToggle={() => change(value === null ? { ...emptyResearchProfile } : null)}
    >
      {value !== null && <ResearchProfileFields value={value} onChange={change} />}
    </DirectionOption>
  );
}
