"use client";

import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldNote } from "@/shared/ui/field-note";
import { FieldStack } from "@/shared/ui/field-stack";
import { GeoSuggestInput } from "@/shared/ui/geo-suggest-input";
import { TextArea } from "@/shared/ui/text-area";
import { TextInput } from "@/shared/ui/text-input";
import { YesNoField } from "@/shared/ui/yes-no-field";
import type { OrderApplicant } from "../../model/details/applicant";
import type { ForensicOrderDetails } from "../../model/details/forensic";
import { OrderApplicantFields } from "../order-applicant-fields";

/** Условия судебной экспертизы и их изменение в форме заказа. */
interface ForensicOrderFieldsProps {
  value: ForensicOrderDetails;
  onChange: (value: ForensicOrderDetails) => void;
}

/** Показывает цель экспертизы, государственный орган, требования к эксперту и сроки. */
export function ForensicOrderFields({ value, onChange }: ForensicOrderFieldsProps) {
  /** Обновляет сведения о заявителе, сохраняя условия экспертизы. */
  function changeApplicant(applicant: OrderApplicant) {
    onChange({
      ...value,
      ...applicant,
    });
  }

  /** Обновляет вопросы, которые должна разрешить экспертиза. */
  function changePurpose(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      expertise_purpose: event.target.value,
    });
  }

  /** Обновляет государственный орган для предоставления заключения. */
  function changeGovernmentBody(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      government_body: event.target.value,
    });
  }

  /** Обновляет введённый или выбранный город предмета экспертизы. */
  function changeCity(city: string) {
    onChange({
      ...value,
      city,
    });
  }

  /** Обновляет требования к образованию эксперта. */
  function changeEducation(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      education_requirement: event.target.value,
    });
  }

  /** Обновляет дополнительные требования к эксперту. */
  function changeExtraRequirements(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      extra_requirements: event.target.value,
    });
  }

  /** Меняет обязательность опыта аналогичных экспертиз. */
  function changeExperienceRequirement(isRequired: boolean) {
    onChange({
      ...value,
      similar_experience_required: isRequired,
    });
  }

  /** Обновляет срок проведения экспертизы. */
  function changeDuration(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      duration: event.target.value,
    });
  }

  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <OrderApplicantFields
          value={value}
          onChange={changeApplicant}
        />
      </Field>
      <Field label="Цель экспертизы">
        <TextArea
          value={value.expertise_purpose}
          onChange={changePurpose}
          placeholder="Какие вопросы должна разрешить экспертиза"
          maxLength={5000}
        />
      </Field>
      <Field label="Государственный орган">
        <TextInput
          value={value.government_body}
          onChange={changeGovernmentBody}
          placeholder="Куда требуется предоставить заключение"
        />
      </Field>
      <Field label="Где находится предмет экспертизы">
        <GeoSuggestInput
          value={value.city}
          onChange={changeCity}
          placeholder="Город"
        />
      </Field>
      <Field label="Требования к образованию эксперта">
        <TextArea
          value={value.education_requirement}
          onChange={changeEducation}
          placeholder="Экспертная специальность, профильное образование"
          maxLength={5000}
        />
      </Field>
      <Field label="Дополнительные требования">
        <TextArea
          value={value.extra_requirements}
          onChange={changeExtraRequirements}
          placeholder="Стаж, сертификаты, допуски"
          maxLength={5000}
        />
      </Field>
      <Field label="Обязателен опыт аналогичных экспертиз">
        <YesNoField
          value={value.similar_experience_required}
          onChange={changeExperienceRequirement}
        />
      </Field>
      <Field label="Срок проведения экспертизы">
        <TextInput
          value={value.duration}
          onChange={changeDuration}
          placeholder="30 дней"
        />
      </Field>
      <FieldNote>Вопросы эксперту приложите на шаге «Документы».</FieldNote>
    </FieldStack>
  );
}
