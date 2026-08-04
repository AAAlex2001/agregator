"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import type { AuditOpoItem } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: AuditOpoItem;
  onChange: (value: AuditOpoItem) => void;
}

export function OpoItemFields({ value, onChange }: Props) {
  return (
    <div className={s.row}>
      <label className={s.cell}>
        <span className={s.cellLabel}>Регистрационный номер ОПО</span>
        <TextInput
          value={value.registration_number}
          onChange={(event) => onChange({ ...value, registration_number: event.target.value })}
          placeholder="А01-12345-0001"
        />
      </label>
      <label className={s.cell}>
        <span className={s.cellLabel}>Наименование ОПО</span>
        <TextInput
          value={value.name}
          onChange={(event) => onChange({ ...value, name: event.target.value })}
          placeholder="Сеть газопотребления"
        />
      </label>
      <label className={s.cell}>
        <span className={s.cellLabel}>Класс опасности</span>
        <TextInput
          value={value.hazard_class}
          onChange={(event) => onChange({ ...value, hazard_class: event.target.value })}
          placeholder="III"
        />
      </label>
      <label className={s.cell}>
        <span className={s.cellLabel}>Адрес местонахождения</span>
        <TextInput
          value={value.address}
          onChange={(event) => onChange({ ...value, address: event.target.value })}
          placeholder="Регион, город, улица"
        />
      </label>
      <label className={s.cell}>
        <span className={s.cellLabel}>Отраслевая принадлежность</span>
        <TextInput
          value={value.industry}
          onChange={(event) => onChange({ ...value, industry: event.target.value })}
          placeholder="Газоснабжение"
        />
      </label>
      <label className={s.cell}>
        <span className={s.cellLabel}>Признаки опасности</span>
        <TextInput
          value={value.hazard_signs}
          onChange={(event) => onChange({ ...value, hazard_signs: event.target.value })}
          placeholder="Использование горючих веществ"
        />
      </label>
    </div>
  );
}
