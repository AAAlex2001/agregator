"use client";

import { KADASTR_SRO_REGISTRY_URL } from "@/source/shared/config/externalLinks";
import { GeoSuggestInput } from "@/source/shared/ui/GeoSuggestInput";
import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { ApplicantFields, Field, FieldNote, FieldStack } from "../../shared";
import type { CadastralOrderDetails } from "./types";

interface CadastralOrderFieldsProps {
  value: CadastralOrderDetails;
  onChange: (value: CadastralOrderDetails) => void;
}

/** Заявка на кадастровые работы: цель, объект, требования к исполнителю и срок. */
export function CadastralOrderFields({ value, onChange }: CadastralOrderFieldsProps) {
  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </Field>

      <Field label="Цель работ">
        <TextArea
          value={value.work_purpose}
          onChange={(event) => onChange({ ...value, work_purpose: event.target.value })}
          placeholder="Межевание участка, технический план, вынос границ в натуру"
          maxLength={5000}
        />
      </Field>

      <Field label="Где находится объект">
        <GeoSuggestInput value={value.city} onChange={(city) => onChange({ ...value, city })} placeholder="Город" />
      </Field>

      <Field label="Требования к образованию исполнителя">
        <TextArea
          value={value.education_requirement}
          onChange={(event) => onChange({ ...value, education_requirement: event.target.value })}
          placeholder="Высшее профильное образование, действующий аттестат"
          maxLength={5000}
        />
      </Field>

      <Field
        label="Обязательное членство в СРО"
        link={{ href: KADASTR_SRO_REGISTRY_URL, text: "Проверить кадастрового инженера по реестру СРО" }}
      >
        <YesNoField value={value.sro_required} onChange={(next) => onChange({ ...value, sro_required: next })} />
      </Field>

      <Field label="Срок проведения работ">
        <TextInput
          value={value.duration}
          onChange={(event) => onChange({ ...value, duration: event.target.value })}
          placeholder="30 дней"
        />
      </Field>

      <FieldNote>Техническое задание приложите в файлах заявки ниже.</FieldNote>
    </FieldStack>
  );
}
