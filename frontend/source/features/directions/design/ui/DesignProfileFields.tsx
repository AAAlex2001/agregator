"use client";

import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { NRS_NOPRIZ_URL } from "@/source/shared/config/externalLinks";
import type { DesignCatalogs, DesignProfile } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: DesignProfile;
  onChange: (value: DesignProfile) => void;
  catalogs: DesignCatalogs;
}

export function DesignProfileFields({ value, onChange, catalogs }: Props) {
  const specialtyOptions = catalogs.specialties.map((option) => ({
    code: option.code,
    title: `${option.short} — ${option.title}`,
  }));
  const rtnOptions = catalogs.rtn_areas.map((option) => ({
    code: option.code,
    title: `${option.code} — ${option.title}`,
  }));

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
        <span className={s.label}>Основные направления проектирования</span>
        <MultiSelect
          id="design-specialties"
          options={specialtyOptions}
          value={value.specialties}
          onChange={(next) => onChange({ ...value, specialties: next })}
        />
      </div>

      <div className={s.field}>
        <span className={s.label}>Независимая оценка квалификации (НОК)</span>
        <YesNoField
          value={value.nok_passed}
          onChange={(next) => onChange({ ...value, nok_passed: next })}
        />
      </div>

      <div className={s.field}>
        <span className={s.label}>Включение в НРС (НОПРИЗ)</span>
        <TextInput
          value={value.nrs_number}
          onChange={(event) => onChange({ ...value, nrs_number: event.target.value })}
          placeholder="Номер в национальном реестре специалистов"
        />
        <a className={s.link} href={NRS_NOPRIZ_URL} target="_blank" rel="noopener noreferrer">
          Проверить себя в НРС НОПРИЗ
        </a>
      </div>

      <div className={s.field}>
        <span className={s.label}>Заявлен какой-либо организацией в СРО как ГИП</span>
        <YesNoField
          value={value.sro_gip_declared}
          onChange={(next) => onChange({ ...value, sro_gip_declared: next })}
        />
      </div>

      <label className={s.field}>
        <span className={s.label}>Повышение квалификации, курсы</span>
        <TextArea
          value={value.qualification_courses}
          onChange={(event) => onChange({ ...value, qualification_courses: event.target.value })}
          placeholder="Программы, учебные центры и годы прохождения"
          maxLength={5000}
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Аттестация в РТН по промышленной безопасности</span>
        <MultiSelect
          id="design-rtn-areas"
          options={rtnOptions}
          value={value.rtn_areas}
          onChange={(next) => onChange({ ...value, rtn_areas: next })}
        />
      </div>
    </div>
  );
}
