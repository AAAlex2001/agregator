"use client";

import { KADASTR_SRO_REGISTRY_URL } from "@/source/shared/config/externalLinks";
import { CalendarInput } from "@/source/shared/ui/CalendarInput";
import { GeoSuggestInput } from "@/source/shared/ui/GeoSuggestInput";
import { TextArea, TextInput } from "@/source/shared/ui/Inputs";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { Cell, Field, FieldStack } from "../../shared";
import type { CadastralProfile } from "./types";

interface CadastralProfileFieldsProps {
  value: CadastralProfile;
  onChange: (value: CadastralProfile) => void;
}

/** Анкета кадастрового инженера: образование, данные реестра, оборудование и место работы. */
export function CadastralProfileFields({ value, onChange }: CadastralProfileFieldsProps) {
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

      <Field
        label="Сведения из реестра кадастровых инженеров"
        link={{ href: KADASTR_SRO_REGISTRY_URL, text: "Проверить себя в реестре СРО кадастровых инженеров" }}
      >
        <FieldStack>
          <Cell label="Дата вступления">
            <CalendarInput
              value={value.registry_joined_at ?? ""}
              onChange={(next) => onChange({ ...value, registry_joined_at: next || null })}
              placeholder="Выберите дату"
            />
          </Cell>
          <Cell label="Номер аттестата">
            <TextInput
              value={value.certificate_number ?? ""}
              onChange={(event) => onChange({ ...value, certificate_number: event.target.value })}
              placeholder="12-34-5678"
            />
          </Cell>
          <Cell label="Реестровый номер">
            <TextInput
              value={value.registry_number ?? ""}
              onChange={(event) => onChange({ ...value, registry_number: event.target.value })}
              placeholder="0000"
            />
          </Cell>
        </FieldStack>
      </Field>

      <Field label="Наличие необходимого оборудования">
        <YesNoField value={value.has_equipment} onChange={(next) => onChange({ ...value, has_equipment: next })} />
      </Field>

      <Field label="Местонахождение">
        <GeoSuggestInput value={value.city} onChange={(city) => onChange({ ...value, city })} placeholder="Город" />
      </Field>

      <Field label="Место работы">
        <TextInput
          value={value.workplace}
          onChange={(event) => onChange({ ...value, workplace: event.target.value })}
          placeholder="Организация или «индивидуальный предприниматель»"
        />
      </Field>
    </FieldStack>
  );
}
