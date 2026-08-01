"use client";

import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { CalendarInput } from "@/source/shared/ui/CalendarInput";
import { KADASTR_SRO_REGISTRY_URL } from "@/source/shared/config/externalLinks";
import type { DirectionFormProps } from "../model/types";
import s from "./DirectionForm.module.scss";

export function CadastralExpertForm({ value, onChange }: DirectionFormProps) {
  const text = (field: string) => String(value[field] ?? "");
  const set = (field: string, next: unknown) => onChange({ ...value, [field]: next });

  return (
    <div className={s.form}>
      <label className={s.field}>
        <span className={s.label}>Образование</span>
        <TextArea
          value={text("education")}
          onChange={(event) => set("education", event.target.value)}
          placeholder="Учебное заведение, специальность, год окончания"
          maxLength={5000}
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Сведения из реестра кадастровых инженеров</span>
        <div className={s.row}>
          <label className={s.cell}>
            <span className={s.cellLabel}>Дата вступления</span>
            <CalendarInput
              value={text("registry_joined_at")}
              onChange={(next) => set("registry_joined_at", next || null)}
              placeholder="Выберите дату"
            />
          </label>
          <label className={s.cell}>
            <span className={s.cellLabel}>Номер аттестата</span>
            <TextInput
              value={text("certificate_number")}
              onChange={(event) => set("certificate_number", event.target.value)}
              placeholder="12-34-5678"
            />
          </label>
          <label className={s.cell}>
            <span className={s.cellLabel}>Реестровый номер</span>
            <TextInput
              value={text("registry_number")}
              onChange={(event) => set("registry_number", event.target.value)}
              placeholder="0000"
            />
          </label>
        </div>
        <a
          className={s.link}
          href={KADASTR_SRO_REGISTRY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Проверить себя в реестре СРО кадастровых инженеров
        </a>
      </div>

      <label className={s.field}>
        <span className={s.label}>Наличие необходимого оборудования</span>
        <TextArea
          value={text("equipment")}
          onChange={(event) => set("equipment", event.target.value)}
          placeholder="Тахеометр, GNSS-приёмник, лазерный дальномер…"
          maxLength={5000}
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Место работы</span>
        <TextInput
          value={text("workplace")}
          onChange={(event) => set("workplace", event.target.value)}
          placeholder="Организация или «индивидуальный предприниматель»"
        />
      </label>
    </div>
  );
}
