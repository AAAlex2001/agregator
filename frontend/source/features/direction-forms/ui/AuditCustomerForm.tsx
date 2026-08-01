"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import type { AuditCustomerProfile } from "@/source/entities/direction";
import type { DirectionFormProps } from "../model/types";
import s from "./DirectionForm.module.scss";

export function AuditCustomerForm({ value, onChange }: DirectionFormProps<AuditCustomerProfile>) {
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
        <span className={s.label}>Номер лицензии на эксплуатацию ОПО</span>
        <TextInput
          value={value.opo_license_number}
          onChange={(event) => onChange({ ...value, opo_license_number: event.target.value })}
          placeholder="ВХ-00-000000"
        />
        <span className={s.hint}>Необязательно сейчас — понадобится до начала аудита</span>
      </label>
    </div>
  );
}
