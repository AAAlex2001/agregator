"use client";

import type { ChangeEvent } from "react";
import { CalendarInput } from "@/shared/ui/calendar-input";
import { Field } from "@/shared/ui/field";
import { FormGrid } from "@/shared/ui/form-grid";
import { FormSection } from "@/shared/ui/form-section";
import { TextInput } from "@/shared/ui/text-input";
import { useOrderForm } from "../../model/order-form-provider";
import type { OrderListItem } from "../../model/order-list-item";
import type { OrderTextField } from "../../model/order-form-types";

/** Уточняет подпись названия для видов работ со своей терминологией. */
function getTitleLabel(workType: OrderListItem["work_type"]): string {
  switch (workType) {
    case "RESEARCH":
      return "Тема";
    case "CADASTRAL":
      return "Наименование работы";
    case "FORENSIC":
      return "Наименование экспертизы";
    case "LABORATORY":
      return "Наименование исследований";
    default:
      return "Название заказа";
  }
}

/** Название, компания, сроки, начальная цена и окончание приёма откликов. */
export function OrderMainFields() {
  const { values, dispatch } = useOrderForm();

  /** Сохраняет значение поля черновика. */
  function change(field: OrderTextField, value: string) {
    dispatch({ type: "field/changed", field, value });
  }

  /** Оставляет в начальной цене только цифры рублей. */
  function changeBudget(event: ChangeEvent<HTMLInputElement>) {
    change("budget", event.target.value.replace(/\D/g, ""));
  }

  return (
    <FormSection
      title="Основные условия"
      hint="Название, сроки и цена попадут в карточку заказа"
    >
      <FormGrid>
        <Field label={getTitleLabel(values.workType)}>
          <TextInput
            required
            placeholder="Введите название"
            value={values.title}
            onChange={(event) => change("title", event.target.value)}
          />
        </Field>
        <Field
          label="Компания"
          hint="Из профиля заказчика"
        >
          <TextInput
            placeholder="Название компании"
            value={values.company}
            disabled
          />
        </Field>
      </FormGrid>
      <FormGrid>
        <Field label="Срок начала выполнения работ">
          <CalendarInput
            value={values.startDate}
            onChange={(value) => change("startDate", value)}
          />
        </Field>
        <Field label="Срок окончания выполнения работ">
          <CalendarInput
            value={values.deadline}
            onChange={(value) => change("deadline", value)}
          />
        </Field>
      </FormGrid>
      <FormGrid>
        <Field
          label="Начальная максимальная цена, ₽"
          hint="Оставьте пустым или 0, если цена не определена"
        >
          <TextInput
            placeholder="Сумма в рублях"
            inputMode="numeric"
            value={values.budget}
            onChange={changeBudget}
          />
        </Field>
        <Field
          label="Приём откликов до"
          hint="Время указано по МСК"
        >
          <CalendarInput
            withTime
            value={values.responsesDeadline}
            onChange={(value) => change("responsesDeadline", value)}
          />
        </Field>
      </FormGrid>
    </FormSection>
  );
}
