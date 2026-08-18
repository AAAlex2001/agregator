"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import type { ApplicantBlock } from "../model/applicant";
import s from "./fields.module.scss";

interface Props {
  value: ApplicantBlock;
  onChange: (value: ApplicantBlock) => void;
}

export function ApplicantFields({ value, onChange }: Props) {
  return (
    <div className={s.grid2}>
      <label className={s.field}>
        <span className={s.label}>ФИО представителя заявителя</span>
        <TextInput
          value={value.applicant_full_name}
          onChange={(event) => onChange({ ...value, applicant_full_name: event.target.value })}
          placeholder="Иванов Иван Иванович"
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Должность</span>
        <TextInput
          value={value.applicant_position}
          onChange={(event) => onChange({ ...value, applicant_position: event.target.value })}
          placeholder="Главный инженер"
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Организация</span>
        <TextInput
          value={value.applicant_organization}
          onChange={(event) => onChange({ ...value, applicant_organization: event.target.value })}
          placeholder="Наименование организации"
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>ИНН</span>
        <TextInput
          value={value.applicant_inn}
          onChange={(event) => onChange({ ...value, applicant_inn: event.target.value })}
          placeholder="10 или 12 цифр"
          inputMode="numeric"
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Контактный телефон</span>
        <TextInput
          value={value.applicant_phone}
          onChange={(event) => onChange({ ...value, applicant_phone: event.target.value })}
          placeholder="+7-999-000-00-00"
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Email</span>
        <TextInput
          value={value.applicant_email}
          onChange={(event) => onChange({ ...value, applicant_email: event.target.value })}
          placeholder="mail@example.com"
        />
      </label>
    </div>
  );
}
