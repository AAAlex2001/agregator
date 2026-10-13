"use client";

import { NRS_NOPRIZ_URL } from "@/source/shared/config/externalLinks";
import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { Field, FieldStack } from "../../shared";
import type { SurveyCatalogs } from "../catalogs/types";
import type { SurveyProfile } from "./types";

interface SurveyProfileFieldsProps {
  value: SurveyProfile;
  onChange: (value: SurveyProfile) => void;
  catalogs: SurveyCatalogs;
}

/** Анкета изыскателя: образование, виды изысканий, НОК, НРС, курсы и аттестация РТН. */
export function SurveyProfileFields({ value, onChange, catalogs }: SurveyProfileFieldsProps) {
  const kindOptions = catalogs.kinds.map((option) => ({ code: option.code, title: `${option.short} — ${option.title}` }));
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

      <Field label="Основные направления изысканий">
        <MultiSelect
          id="survey-kinds"
          options={kindOptions}
          value={value.kinds}
          onChange={(next) => onChange({ ...value, kinds: next })}
        />
      </Field>

      <Field label="Другие направления изысканий">
        <TextInput
          value={value.kinds_other}
          onChange={(event) => onChange({ ...value, kinds_other: event.target.value })}
          placeholder="Если вашего направления нет в списке — впишите его"
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
          id="survey-rtn-areas"
          options={rtnOptions}
          value={value.rtn_areas}
          onChange={(next) => onChange({ ...value, rtn_areas: next })}
        />
      </Field>
    </FieldStack>
  );
}
