"use client";

import type { Dispatch } from "react";
import { CalendarInput } from "@/shared/ui/calendar-input";
import { Field } from "@/shared/ui/field";
import { TextInput } from "@/shared/ui/text-input";
import type { ResponseOffer, ResponseOfferAction } from "../../model/offer";
import { VatKindField } from "../vat-kind-field";
import styles from "./style.module.scss";

/** Предложение и его изменения. */
interface ResponseTermsFieldsProps {
  offer: ResponseOffer;
  dispatch: Dispatch<ResponseOfferAction>;
}

/** Сроки, стоимость и НДС предложения исполнителя. */
export function ResponseTermsFields({ offer, dispatch }: ResponseTermsFieldsProps) {
  return (
    <div className={styles.fields}>
      <div className={styles.dates}>
        <Field label="Срок начала выполнения работ">
          <CalendarInput
            value={offer.startDate}
            placeholder="Выберите дату"
            onChange={(value) => dispatch({ type: "field/changed", field: "startDate", value })}
          />
        </Field>
        <Field label="Срок окончания выполнения работ">
          <CalendarInput
            value={offer.deadline}
            placeholder="Выберите дату"
            onChange={(value) => dispatch({ type: "field/changed", field: "deadline", value })}
          />
        </Field>
      </div>
      <Field
        label="Ваша оценка стоимости работ, ₽"
        hint="Сумма ориентировочная: точную стоимость согласуете с заказчиком после изучения ТЗ"
      >
        <TextInput
          inputMode="numeric"
          value={offer.cost}
          placeholder="Сумма в рублях"
          onChange={(event) => dispatch({ type: "cost/changed", value: event.target.value })}
        />
      </Field>
      <Field label="НДС">
        <VatKindField
          value={offer.vatKind}
          baseAmount={Number(offer.cost) || 0}
          onChange={(value) => dispatch({ type: "vat/changed", value })}
        />
      </Field>
    </div>
  );
}