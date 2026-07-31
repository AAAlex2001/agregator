import type { UseFormReturn } from "react-hook-form";
import { PartySuggestInput, type PartySuggestion } from "@/source/features/party-suggest";
import type { RegisterFormValues } from "../../model/schema";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
}

export function OrganizationField({ form }: Props) {
  const { watch, setValue, formState } = form;
  const shouldValidate = formState.isSubmitted;

  return (
    <PartySuggestInput
      value={watch("companyName")}
      onChange={(query: string, picked: PartySuggestion | null) => {
        setValue("companyName", picked?.value ?? query, { shouldValidate });
        setValue("companyData", picked, { shouldValidate });
      }}
      placeholder="ИНН или название организации"
      error={formState.errors.companyName?.message as string | undefined}
    />
  );
}
