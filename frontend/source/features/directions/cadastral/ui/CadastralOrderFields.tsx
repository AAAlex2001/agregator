"use client";

import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { GeoSuggestInput } from "@/source/shared/ui/GeoSuggestInput";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { KADASTR_SRO_REGISTRY_URL } from "@/source/shared/config/externalLinks";
import { ApplicantFields } from "../../shared/ui/ApplicantFields";
import type { CadastralOrderDetails } from "../model/types";
import s from "../../shared/ui/fields.module.scss";

interface Props {
  value: CadastralOrderDetails;
  onChange: (value: CadastralOrderDetails) => void;
}

export function CadastralOrderFields({ value, onChange }: Props) {
  return (
    <div className={s.form}>
      <div className={s.field}>
        <span className={s.label}>Сведения о заявителе</span>
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </div>

      <label className={s.field}>
        <span className={s.label}>Цель работ</span>
        <TextArea
          value={value.work_purpose}
          onChange={(event) => onChange({ ...value, work_purpose: event.target.value })}
          placeholder="Межевание участка, технический план, вынос границ в натуру"
          maxLength={5000}
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Где находится объект</span>
        <GeoSuggestInput
          value={value.city}
          onChange={(city) => onChange({ ...value, city })}
          placeholder="Город"
        />
      </div>

      <label className={s.field}>
        <span className={s.label}>Требования к образованию исполнителя</span>
        <TextArea
          value={value.education_requirement}
          onChange={(event) => onChange({ ...value, education_requirement: event.target.value })}
          placeholder="Высшее профильное образование, действующий аттестат"
          maxLength={5000}
        />
      </label>

      <div className={s.field}>
        <span className={s.label}>Обязательное членство в СРО</span>
        <YesNoField
          value={value.sro_required}
          onChange={(next) => onChange({ ...value, sro_required: next })}
        />
        <a
          className={s.link}
          href={KADASTR_SRO_REGISTRY_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Проверить кадастрового инженера по реестру СРО
        </a>
      </div>

      <label className={s.field}>
        <span className={s.label}>Срок проведения работ</span>
        <TextInput
          value={value.duration}
          onChange={(event) => onChange({ ...value, duration: event.target.value })}
          placeholder="30 дней"
        />
      </label>

      <span className={s.hint}>Техническое задание приложите в файлах заявки ниже.</span>
    </div>
  );
}
