"use client";

import { GeoSuggestInput } from "@/source/shared/ui/GeoSuggestInput";
import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { ApplicantFields, Field, FieldNote, FieldStack } from "../../shared";
import type { ForensicOrderDetails } from "./types";

interface ForensicOrderFieldsProps {
  value: ForensicOrderDetails;
  onChange: (value: ForensicOrderDetails) => void;
}

/** Заявка на судебную экспертизу: цель, орган, место, требования к эксперту и срок. */
export function ForensicOrderFields({ value, onChange }: ForensicOrderFieldsProps) {
  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </Field>

      <Field label="Цель экспертизы">
        <TextArea
          value={value.expertise_purpose}
          onChange={(event) => onChange({ ...value, expertise_purpose: event.target.value })}
          placeholder="Какие вопросы должна разрешить экспертиза"
          maxLength={5000}
        />
      </Field>

      <Field label="Государственный орган">
        <TextInput
          value={value.government_body}
          onChange={(event) => onChange({ ...value, government_body: event.target.value })}
          placeholder="Куда требуется предоставить заключение"
        />
      </Field>

      <Field label="Где находится предмет экспертизы">
        <GeoSuggestInput value={value.city} onChange={(city) => onChange({ ...value, city })} placeholder="Город" />
      </Field>

      <Field label="Требования к образованию эксперта">
        <TextArea
          value={value.education_requirement}
          onChange={(event) => onChange({ ...value, education_requirement: event.target.value })}
          placeholder="Экспертная специальность, профильное образование"
          maxLength={5000}
        />
      </Field>

      <Field label="Дополнительные требования">
        <TextArea
          value={value.extra_requirements}
          onChange={(event) => onChange({ ...value, extra_requirements: event.target.value })}
          placeholder="Стаж, сертификаты, допуски"
          maxLength={5000}
        />
      </Field>

      <Field label="Обязателен опыт аналогичных экспертиз">
        <YesNoField
          value={value.similar_experience_required}
          onChange={(next) => onChange({ ...value, similar_experience_required: next })}
        />
      </Field>

      <Field label="Срок проведения экспертизы">
        <TextInput
          value={value.duration}
          onChange={(event) => onChange({ ...value, duration: event.target.value })}
          placeholder="30 дней"
        />
      </Field>

      <FieldNote>Вопросы эксперту приложите в файлах заявки ниже.</FieldNote>
    </FieldStack>
  );
}
