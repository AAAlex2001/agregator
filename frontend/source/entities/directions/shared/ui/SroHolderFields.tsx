"use client";

import { NOPRIZ_SRO_REGISTRY_URL } from "@/source/shared/config/externalLinks";
import { RentalPriceField } from "@/source/shared/ui";
import { TextInput } from "@/source/shared/ui/Inputs";
import { RadioGroup } from "@/source/shared/ui/RadioGroup";
import { YesNoField } from "@/source/shared/ui/YesNoField";
import { SRO_LIABILITY_LEVELS, type SroHolderProfile } from "../model/sroHolder";
import { Field } from "./Field";
import { FieldStack } from "./FieldStack";

export interface SroHolderLabels {
  sro: string;
  hazardousRight: string;
  nuclearRight: string;
}

interface SroHolderFieldsProps {
  name: string;
  labels: SroHolderLabels;
  value: SroHolderProfile;
  onChange: (value: SroHolderProfile) => void;
}

/** Анкета члена СРО: реестр, права на особые объекты, уровень ответственности и цена. Подписи задаёт направление. */
export function SroHolderFields({ name, labels, value, onChange }: SroHolderFieldsProps) {
  return (
    <FieldStack>
      <Field label={labels.sro}>
        <TextInput
          value={value.sro_name}
          onChange={(event) => onChange({ ...value, sro_name: event.target.value })}
          placeholder="Полное наименование саморегулируемой организации"
        />
      </Field>

      <Field
        label="Номер в реестре членов СРО"
        link={{ href: NOPRIZ_SRO_REGISTRY_URL, text: "Проверить организацию в едином реестре НОПРИЗ" }}
      >
        <TextInput
          value={value.sro_registry_number}
          onChange={(event) => onChange({ ...value, sro_registry_number: event.target.value })}
          placeholder="Регистрационный номер в реестре членов"
        />
      </Field>

      <Field label={labels.hazardousRight}>
        <YesNoField
          value={value.hazardous_objects_right}
          onChange={(next) => onChange({ ...value, hazardous_objects_right: next })}
        />
      </Field>

      <Field label={labels.nuclearRight}>
        <YesNoField value={value.nuclear_objects_right} onChange={(next) => onChange({ ...value, nuclear_objects_right: next })} />
      </Field>

      <Field label="Компенсационный фонд возмещения вреда — уровень ответственности">
        <RadioGroup
          name={`${name}-liability-level`}
          value={value.liability_level}
          options={SRO_LIABILITY_LEVELS}
          onChange={(next) => onChange({ ...value, liability_level: next })}
        />
      </Field>

      <RentalPriceField
        kind={value.pricing_kind}
        percent={value.pricing_percent}
        fixedAmount={value.pricing_fixed_amount}
        name={`${name}-pricing-kind`}
        legend="Стоимость услуг"
        onChangeKind={(next) => onChange({ ...value, pricing_kind: next })}
        onChangePercent={(next) => onChange({ ...value, pricing_percent: next })}
        onChangeFixed={(next) => onChange({ ...value, pricing_fixed_amount: next })}
      />
    </FieldStack>
  );
}
