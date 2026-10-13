"use client";

import { GeoSuggestInput } from "@/source/shared/ui/GeoSuggestInput";
import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import Tabs from "@/source/shared/ui/Tabs";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { Field, FieldStack } from "../../shared";
import type { ForensicProfile, ForensicWorkplaceKind } from "./types";

const WORKPLACE_TABS = [
  { id: "INDIVIDUAL", label: "Действую как физлицо" },
  { id: "ORGANIZATION", label: "Экспертная организация" },
];

interface ForensicProfileFieldsProps {
  value: ForensicProfile;
  onChange: (value: ForensicProfile) => void;
}

/** Анкета судебного эксперта: образование, опыт, учёная степень, город и место работы. */
export function ForensicProfileFields({ value, onChange }: ForensicProfileFieldsProps) {
  return (
    <FieldStack>
      <Field label="Образование">
        <TextArea
          value={value.education}
          onChange={(event) => onChange({ ...value, education: event.target.value })}
          placeholder="Учебное заведение, специальность, экспертная специальность"
          maxLength={5000}
        />
      </Field>

      <Field label="Дополнительное образование, курсы">
        <TextArea
          value={value.extra_education}
          onChange={(event) => onChange({ ...value, extra_education: event.target.value })}
          placeholder="Курсы повышения квалификации, сертификаты"
          maxLength={5000}
        />
      </Field>

      <Field label="Опыт проведения аналогичных экспертиз">
        <YesNoField
          value={value.has_similar_experience}
          onChange={(next) => onChange({ ...value, has_similar_experience: next })}
        />
      </Field>

      <Field label="Учёная степень">
        <YesNoField
          value={value.has_degree}
          onChange={(next) => onChange({ ...value, has_degree: next, degree: next ? value.degree : "" })}
        />
        {value.has_degree && (
          <TextInput
            value={value.degree}
            onChange={(event) => onChange({ ...value, degree: event.target.value })}
            placeholder="Кандидат юридических наук"
          />
        )}
      </Field>

      <Field label="Местонахождение">
        <GeoSuggestInput value={value.city} onChange={(city) => onChange({ ...value, city })} placeholder="Город" />
      </Field>

      <Field label="Место работы">
        <Tabs
          tabs={WORKPLACE_TABS}
          activeTab={value.workplace_kind}
          onTabChange={(id) => onChange({ ...value, workplace_kind: id as ForensicWorkplaceKind })}
          variant="squared"
        />
        {value.workplace_kind === "ORGANIZATION" && (
          <TextInput
            value={value.workplace_name}
            onChange={(event) => onChange({ ...value, workplace_name: event.target.value })}
            placeholder="Наименование экспертной организации"
          />
        )}
      </Field>
    </FieldStack>
  );
}
