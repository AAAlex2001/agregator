"use client";

import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { RadioGroup } from "@/shared/ui/radio-group";
import { SRO_LIABILITY_LEVELS } from "../../config/options";
import type {
  SroDirection,
  SroPricingKind,
  SroProfileValues,
} from "../../model/types";
import { MembershipFields } from "../membership-fields";
import { ObjectRightsFields } from "../object-rights-fields";
import { PriceFields } from "../price-fields";

/** Направление СРО, редактируемые поля и их изменение. */
interface SroProfileFieldsProps {
  direction: SroDirection;
  value: SroProfileValues;
  onChange: (value: SroProfileValues) => void;
}

/** Анкета члена СРО проектировщиков или изыскателей для регистрации и настроек. */
export function SroProfileFields({
  direction,
  value,
  onChange,
}: SroProfileFieldsProps) {
  /** Меняет название саморегулируемой организации. */
  function changeName(sro_name: string) {
    onChange({
      ...value,
      sro_name,
    });
  }

  /** Меняет регистрационный номер организации. */
  function changeRegistryNumber(sro_registry_number: string) {
    onChange({
      ...value,
      sro_registry_number,
    });
  }

  /** Меняет право работы с особо опасными объектами. */
  function changeHazardousObjects(hazardous_objects_right: boolean) {
    onChange({
      ...value,
      hazardous_objects_right,
    });
  }

  /** Меняет право работы с объектами атомной энергии. */
  function changeNuclearObjects(nuclear_objects_right: boolean) {
    onChange({
      ...value,
      nuclear_objects_right,
    });
  }

  /** Выбирает уровень ответственности члена СРО. */
  function changeLiabilityLevel(liability_level: string) {
    onChange({
      ...value,
      liability_level,
    });
  }

  /** Выбирает способ расчёта стоимости услуг. */
  function changePricingKind(pricing_kind: SroPricingKind) {
    onChange({
      ...value,
      pricing_kind,
    });
  }

  /** Меняет процент от суммы договора. */
  function changePricingPercent(pricing_percent: string) {
    onChange({
      ...value,
      pricing_percent,
    });
  }

  /** Меняет фиксированную стоимость услуг. */
  function changePricingFixedAmount(pricing_fixed_amount: string) {
    onChange({
      ...value,
      pricing_fixed_amount,
    });
  }

  return (
    <FieldStack>
      <MembershipFields
        direction={direction}
        name={value.sro_name}
        registryNumber={value.sro_registry_number}
        onNameChange={changeName}
        onRegistryNumberChange={changeRegistryNumber}
      />

      <ObjectRightsFields
        direction={direction}
        hazardousObjectsRight={value.hazardous_objects_right}
        nuclearObjectsRight={value.nuclear_objects_right}
        onHazardousObjectsChange={changeHazardousObjects}
        onNuclearObjectsChange={changeNuclearObjects}
      />

      <Field label="Компенсационный фонд возмещения вреда — уровень ответственности">
        <RadioGroup
          name={`${direction}-liability-level`}
          value={value.liability_level}
          options={SRO_LIABILITY_LEVELS}
          onChange={changeLiabilityLevel}
        />
      </Field>

      <PriceFields
        name={`${direction}-pricing-kind`}
        kind={value.pricing_kind}
        percent={value.pricing_percent}
        fixedAmount={value.pricing_fixed_amount}
        onKindChange={changePricingKind}
        onPercentChange={changePricingPercent}
        onFixedAmountChange={changePricingFixedAmount}
      />
    </FieldStack>
  );
}
