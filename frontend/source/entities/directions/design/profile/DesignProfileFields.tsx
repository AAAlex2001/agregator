"use client";

import { NRS_NOPRIZ_URL } from "@/source/shared/config/externalLinks";
import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { Field, FieldStack } from "../../shared";
import type { DesignCatalogs } from "../catalogs/types";
import type { DesignProfile } from "./types";

interface DesignProfileFieldsProps {
  value: DesignProfile;
  onChange: (value: DesignProfile) => void;
  catalogs: DesignCatalogs;
}

/** Анкета проектировщика: образование, специальности, НОК, НРС, курсы и аттестация РТН. */
export function DesignProfileFields({ value, onChange, catalogs }: DesignProfileFieldsProps) {
  const specialtyOptions = catalogs.specialties.map((option) => ({
    code: option.code,
    title: `${option.short} — ${option.title}`,
  }));
  const rtnOptions = catalogs.rtn_areas.map((option) => ({ code: option.code, title: `${option.code} — ${option.title}` }));

  return (
    <FieldStack>
      <Field label="Образование">
        <TextArea
          value={value.education}
          onChange={(event) => onChange({ ...value, education: event.target.value })}
          placeholder="Учебное заведение, специальность, год окончания"
          maxLength={5000}
        />
      </Field>

      <Field label="Основные направления проектирования">
        <MultiSelect
          id="design-specialties"
          options={specialtyOptions}
          value={value.specialties}
          onChange={(next) => onChange({ ...value, specialties: next })}
        />
      </Field>

      <Field label="Независимая оценка квалификации (НОК)">
        <YesNoField value={value.nok_passed} onChange={(next) => onChange({ ...value, nok_passed: next })} />
      </Field>

      <Field label="Включение в НРС (НОПРИЗ)" link={{ href: NRS_NOPRIZ_URL, text: "Проверить себя в НРС НОПРИЗ" }}>
        <TextInput
          value={value.nrs_number}
          onChange={(event) => onChange({ ...value, nrs_number: event.target.value })}
          placeholder="Номер в национальном реестре специалистов"
        />
      </Field>

      <Field label="Заявлен какой-либо организацией в СРО как ГИП">
        <YesNoField value={value.sro_gip_declared} onChange={(next) => onChange({ ...value, sro_gip_declared: next })} />
      </Field>

      <Field label="Повышение квалификации, курсы">
        <TextArea
          value={value.qualification_courses}
          onChange={(event) => onChange({ ...value, qualification_courses: event.target.value })}
          placeholder="Программы, учебные центры и годы прохождения"
          maxLength={5000}
        />
      </Field>

      <Field label="Аттестация в РТН по промышленной безопасности">
        <MultiSelect
          id="design-rtn-areas"
          options={rtnOptions}
          value={value.rtn_areas}
          onChange={(next) => onChange({ ...value, rtn_areas: next })}
        />
      </Field>
    </FieldStack>
  );
}
