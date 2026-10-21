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
import type { CadastralOrderDetails } from "../../model/details/cadastral";
import { OrderApplicantFields } from "../order-applicant-fields";

/** Условия кадастровых работ и адрес реестра для проверки исполнителя. */
interface CadastralOrderFieldsProps {
  value: CadastralOrderDetails;
  onChange: (value: CadastralOrderDetails) => void;
  sroRegistryUrl: string;
}

/** Показывает цель, объект, требования к кадастровому инженеру и сроки. */
export function CadastralOrderFields({
  value,
  onChange,
  sroRegistryUrl,
}: CadastralOrderFieldsProps) {
  /** Обновляет сведения о заявителе, сохраняя условия работ. */
  function changeApplicant(applicant: OrderApplicant) {
    onChange({
      ...value,
      ...applicant,
    });
  }

  /** Обновляет цель кадастровых работ. */
  function changePurpose(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      work_purpose: event.target.value,
    });
  }

  /** Обновляет введённый или выбранный город объекта. */
  function changeCity(city: string) {
    onChange({
      ...value,
      city,
    });
  }

  /** Обновляет требования к образованию исполнителя. */
  function changeEducation(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      education_requirement: event.target.value,
    });
  }

  /** Меняет обязательность членства исполнителя в СРО. */
  function changeSroRequirement(isRequired: boolean) {
    onChange({
      ...value,
      sro_required: isRequired,
    });
  }

  /** Обновляет срок кадастровых работ. */
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
      <Field label="Цель работ">
        <TextArea
          value={value.work_purpose}
          onChange={changePurpose}
          placeholder="Межевание участка, технический план, вынос границ в натуру"
          maxLength={5000}
        />
      </Field>
      <Field label="Где находится объект">
        <GeoSuggestInput
          value={value.city}
          onChange={changeCity}
          placeholder="Город"
        />
      </Field>
      <Field label="Требования к образованию исполнителя">
        <TextArea
          value={value.education_requirement}
          onChange={changeEducation}
          placeholder="Высшее профильное образование, действующий аттестат"
          maxLength={5000}
        />
      </Field>
      <Field
        label="Обязательное членство в СРО"
        link={{
          href: sroRegistryUrl,
          text: "Проверить кадастрового инженера по реестру СРО",
        }}
      >
        <YesNoField
          value={value.sro_required}
          onChange={changeSroRequirement}
        />
      </Field>
      <Field label="Срок проведения работ">
        <TextInput
          value={value.duration}
          onChange={changeDuration}
          placeholder="30 дней"
        />
      </Field>
      <FieldNote>Техническое задание приложите на шаге «Документы».</FieldNote>
    </FieldStack>
  );
}
