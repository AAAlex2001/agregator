import type { UseFormReturn } from "react-hook-form";
import { TextInput } from "@/source/shared/ui/Inputs";
import type { RegisterFormValues } from "../../model/schema";
import { ExpertLocationField } from "./ExpertLocationField";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
}

export function ExpertProfileFields({ form }: Props) {
  const { watch, setValue, formState } = form;
  const errors = formState.errors;
  const shouldValidate = formState.isSubmitted;

  return (
    <>
      <TextInput
        id="lastName"
        value={watch("lastName")}
        autoComplete="off"
        onChange={(e) => setValue("lastName", e.target.value, { shouldValidate })}
        placeholder="Фамилия"
        error={errors.lastName?.message}
      />
      <TextInput
        id="firstName"
        value={watch("firstName")}
        autoComplete="off"
        onChange={(e) => setValue("firstName", e.target.value, { shouldValidate })}
        placeholder="Имя"
        error={errors.firstName?.message}
      />

      <ExpertLocationField form={form} />
    </>
  );
}
