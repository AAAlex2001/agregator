"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import type { AuditCustomerProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: AuditCustomerProfile;
  onChange: (value: AuditCustomerProfile) => void;
}

export function AuditCustomerProfileFields({ value, onChange }: Props) {
  return (
    <div className={s.form}>
      <label className={s.field}>
        <span className={s.label}>Должность представителя</span>
        <TextInput
          value={value.position}
          onChange={(event) => onChange({ ...value, position: event.target.value })}
          placeholder="Главный инженер"
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Лицензия на эксплуатацию ОПО (при наличии)</span>
        <TextInput
          value={value.opo_license_number}
          onChange={(event) => onChange({ ...value, opo_license_number: event.target.value })}
          placeholder="Номер лицензии"
        />
      </label>
    </div>
  );
}
