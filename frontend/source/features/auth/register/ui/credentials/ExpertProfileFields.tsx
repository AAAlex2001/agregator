import type { UseFormReturn } from "react-hook-form";
import { TextInput } from "@/source/shared/ui/Inputs";
import { FormSection } from "@/source/shared/ui";
import { ExpertMapVisibilityFields } from "@/source/entities/expert";
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

      <FormSection
        title="Где вы находитесь"
        hint="Город и район базирования — заказчикам проще выбрать исполнителя рядом. Это не личный адрес, можно заполнить позже в профиле."
        collapsible
      >
        <ExpertLocationField form={form} />

        <ExpertMapVisibilityFields
          showOnMap={watch("showOnMap")}
          mapFields={watch("mapFields")}
          onChangeShowOnMap={(next) => setValue("showOnMap", next)}
          onChangeMapFields={(next) => setValue("mapFields", next)}
        />
      </FormSection>
    </>
  );
}
