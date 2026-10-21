"use client";

import { Field } from "@/shared/ui/field";
import { FormSection } from "@/shared/ui/form-section";
import { TextArea } from "@/shared/ui/text-area";
import { useOrderForm } from "../../model/order-form-provider";

/** Свободное пояснение заказчика к условиям работ. */
export function OrderCommentField() {
  const { values, dispatch } = useOrderForm();

  return (
    <FormSection
      title="Комментарий"
      hint="Необязательно. Комментарий увидят исполнители в карточке заказа"
    >
      <Field label="Что важно знать исполнителю">
        <TextArea
          value={values.comment}
          rows={5}
          placeholder="Особенности объекта, порядок работ, на что обратить внимание"
          onChange={(event) => dispatch({
            type: "field/changed",
            field: "comment",
            value: event.target.value,
          })}
        />
      </Field>
    </FormSection>
  );
}
