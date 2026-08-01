import type { UseFormReturn } from "react-hook-form";
import { FormSection } from "@/source/shared/ui";
import { ExpertMapVisibilityFields } from "@/source/entities/expert";
import type { RegisterFormValues } from "../../model/schema";
import { ExpertLocationField } from "./ExpertLocationField";
import { NameFields } from "./NameFields";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
}

export function ExpertProfileFields({ form }: Props) {
  const { watch, setValue } = form;

  return (
    <>
      <NameFields form={form} />

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
