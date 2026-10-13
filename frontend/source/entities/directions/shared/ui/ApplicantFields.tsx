"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import type { ApplicantBlock } from "../model/applicant";
import { Field } from "./Field";
import s from "./ApplicantFields.module.scss";

interface ApplicantFieldsProps {
  value: ApplicantBlock;
  onChange: (value: ApplicantBlock) => void;
}

/** Сведения о заявителе в заявке: представитель, организация и контакты, в две колонки. */
export function ApplicantFields({ value, onChange }: ApplicantFieldsProps) {
  return (
    <div className={s.grid}>
      <Field label="ФИО представителя заявителя">
        <TextInput
          value={value.applicant_full_name}
          onChange={(event) => onChange({ ...value, applicant_full_name: event.target.value })}
          placeholder="Иванов Иван Иванович"
        />
      </Field>
      <Field label="Должность">
        <TextInput
          value={value.applicant_position}
          onChange={(event) => onChange({ ...value, applicant_position: event.target.value })}
          placeholder="Главный инженер"
        />
      </Field>
      <Field label="Организация">
        <TextInput
          value={value.applicant_organization}
          onChange={(event) => onChange({ ...value, applicant_organization: event.target.value })}
          placeholder="Наименование организации"
        />
      </Field>
      <Field label="ИНН">
        <TextInput
          value={value.applicant_inn}
          onChange={(event) => onChange({ ...value, applicant_inn: event.target.value })}
          placeholder="10 или 12 цифр"
          inputMode="numeric"
        />
      </Field>
      <Field label="Контактный телефон">
        <TextInput
          value={value.applicant_phone}
          onChange={(event) => onChange({ ...value, applicant_phone: event.target.value })}
          placeholder="+7-999-000-00-00"
        />
      </Field>
      <Field label="Email">
        <TextInput
          value={value.applicant_email}
          onChange={(event) => onChange({ ...value, applicant_email: event.target.value })}
          placeholder="mail@example.com"
        />
      </Field>
    </div>
  );
}
