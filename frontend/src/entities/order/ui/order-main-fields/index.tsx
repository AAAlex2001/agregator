"use client";

import type { ChangeEvent } from "react";
import { CalendarInput } from "@/shared/ui/calendar-input";
import { TextInput } from "@/shared/ui/text-input";
import { useOrderForm } from "../../model/order-form-provider";
import type { OrderListItem } from "../../model/order-list-item";
import { OrderFormSection } from "../order-form-section";
import styles from "./style.module.scss";

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

/** Показывает название, компанию, сроки и начальную цену заказа. */
export function OrderMainFields() {
  const { values, dispatch } = useOrderForm();

  /** Обновляет название заказа. */
  function changeTitle(event: ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "field/changed",
      field: "title",
      value: event.target.value,
    });
  }

  /** Обновляет дату начала работ. */
  function changeStartDate(value: string) {
    dispatch({
      type: "field/changed",
      field: "startDate",
      value,
    });
  }

  /** Обновляет дату окончания работ. */
  function changeDeadline(value: string) {
    dispatch({
      type: "field/changed",
      field: "deadline",
      value,
    });
  }

  /** Оставляет в начальной цене только цифры рублей. */
  function changeBudget(event: ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "field/changed",
      field: "budget",
      value: event.target.value.replace(/\D/g, ""),
    });
  }

  /** Обновляет дату и московское время завершения приёма откликов. */
  function changeResponsesDeadline(value: string) {
    dispatch({
      type: "field/changed",
      field: "responsesDeadline",
      value,
    });
  }

  return (
    <OrderFormSection>
      <div className={styles.grid}>
        <div className={styles.field}>
          <span className={styles.label}>{getTitleLabel(values.workType)}</span>
          <TextInput
            required
            placeholder="Введите название"
            value={values.title}
            onChange={changeTitle}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Компания</span>
          <TextInput
            placeholder="Название компании"
            value={values.company}
            disabled
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Срок начала выполнения работ</span>
          <CalendarInput
            active
            value={values.startDate}
            onChange={changeStartDate}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Срок окончания выполнения работ</span>
          <CalendarInput
            active
            value={values.deadline}
            onChange={changeDeadline}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Начальная максимальная цена, ₽</span>
          <TextInput
            placeholder="Сумма в рублях (0 — не определено)"
            inputMode="numeric"
            value={values.budget}
            onChange={changeBudget}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Приём откликов до</span>
          <CalendarInput
            active
            withTime
            value={values.responsesDeadline}
            onChange={changeResponsesDeadline}
          />
          <span className={styles.timezoneHint}>Время указано по МСК</span>
        </div>
      </div>
    </OrderFormSection>
  );
}
