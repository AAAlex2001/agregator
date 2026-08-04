"use client";

import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { CalendarInput } from "@/source/shared/ui/CalendarInput";
import { GeoSuggestInput } from "@/source/shared/ui/GeoSuggestInput";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { KADASTR_SRO_REGISTRY_URL } from "@/source/shared/config/externalLinks";
import type { CadastralProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: CadastralProfile;
  onChange: (value: CadastralProfile) => void;
}

export function CadastralProfileFields({ value, onChange }: Props) {
  return (
    <div className={s.form}>
      <label className={s.field}>
        <span className={s.label}>Образование</span>
        <TextArea
          value={value.education}
          onChange={(event) => onChange({ ...value, education: event.target.value })}
          placeholder="Учебное заведение, специальность, год окончания"
          maxLength={5000}
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Сведения из реестра кадастровых инженеров</span>
        <div className={s.row}>
          <div className={s.cell}>
            <span className={s.cellLabel}>Дата вступления</span>
            <CalendarInput
              value={value.registry_joined_at ?? ""}
              onChange={(next) => onChange({ ...value, registry_joined_at: next || null })}
              placeholder="Выберите дату"
            />
          </div>
          <label className={s.cell}>
            <span className={s.cellLabel}>Номер аттестата</span>
            <TextInput
              value={value.certificate_number ?? ""}
              onChange={(event) => onChange({ ...value, certificate_number: event.target.value })}
              placeholder="12-34-5678"
            />
          </label>
          <label className={s.cell}>
            <span className={s.cellLabel}>Реестровый номер</span>
            <TextInput
              value={value.registry_number ?? ""}
              onChange={(event) => onChange({ ...value, registry_number: event.target.value })}
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

      <div className={s.field}>
        <span className={s.label}>Наличие необходимого оборудования</span>
        <YesNoField
          value={value.has_equipment}
          onChange={(next) => onChange({ ...value, has_equipment: next })}
        />
      </div>

      <div className={s.field}>
        <span className={s.label}>Местонахождение</span>
        <GeoSuggestInput
          value={value.city}
          onChange={(city) => onChange({ ...value, city })}
          placeholder="Город"
        />
      </div>

      <label className={s.field}>
        <span className={s.label}>Место работы</span>
        <TextInput
          value={value.workplace}
          onChange={(event) => onChange({ ...value, workplace: event.target.value })}
          placeholder="Организация или «индивидуальный предприниматель»"
        />
      </label>
    </div>
  );
}
