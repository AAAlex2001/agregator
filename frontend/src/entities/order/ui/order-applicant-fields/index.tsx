"use client";

import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { TextInput } from "@/shared/ui/text-input";
import type { OrderApplicant } from "../../model/details/applicant";
import styles from "./style.module.scss";

/** Представитель заказчика, его организация и контакты в заявке. */
interface OrderApplicantFieldsProps {
  value: OrderApplicant;
  onChange: (value: OrderApplicant) => void;
}

/** Показывает общие сведения о заявителе в две колонки. */
export function OrderApplicantFields({
  value,
  onChange,
}: OrderApplicantFieldsProps) {
  /** Обновляет ФИО представителя заказчика. */
  function changeFullName(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      applicant_full_name: event.target.value,
    });
  }

  /** Обновляет должность представителя. */
  function changePosition(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      applicant_position: event.target.value,
    });
  }

  /** Обновляет название организации заявителя. */
  function changeOrganization(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      applicant_organization: event.target.value,
    });
  }

  /** Обновляет ИНН заявителя. */
  function changeInn(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      applicant_inn: event.target.value,
    });
  }

  /** Обновляет контактный телефон. */
  function changePhone(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      applicant_phone: event.target.value,
    });
  }

  /** Обновляет контактную почту. */
  function changeEmail(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      applicant_email: event.target.value,
    });
  }

  return (
    <div className={styles.grid}>
      <Field label="ФИО представителя заявителя">
        <TextInput
          value={value.applicant_full_name}
          onChange={changeFullName}
          placeholder="Иванов Иван Иванович"
        />
      </Field>
      <Field label="Должность">
        <TextInput
          value={value.applicant_position}
          onChange={changePosition}
          placeholder="Главный инженер"
        />
      </Field>
      <Field label="Организация">
        <TextInput
          value={value.applicant_organization}
          onChange={changeOrganization}
          placeholder="Наименование организации"
        />
      </Field>
      <Field label="ИНН">
        <TextInput
          value={value.applicant_inn}
          onChange={changeInn}
          placeholder="10 или 12 цифр"
          inputMode="numeric"
        />
      </Field>
      <Field label="Контактный телефон">
        <TextInput
          value={value.applicant_phone}
          onChange={changePhone}
          placeholder="+7-999-000-00-00"
        />
      </Field>
      <Field label="Email">
        <TextInput
          value={value.applicant_email}
          onChange={changeEmail}
          placeholder="mail@example.com"
        />
      </Field>
    </div>
  );
}
