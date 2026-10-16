"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { TextInput } from "@/shared/ui/text-input";
import type {
  TechDiagHolderProfile,
  TechDiagOptions,
} from "../../model/types";
import { ControlMethodsField } from "../control-methods-field";

/** Виды контроля, город лаборатории и варианты доступных методов. */
interface TechDiagHolderProfileFieldsProps {
  value: TechDiagHolderProfile;
  options: TechDiagOptions;
  onChange: (value: TechDiagHolderProfile) => void;
}

/** Виды контроля и город, в котором находится лаборатория. */
export function TechDiagHolderProfileFields({
  value,
  options,
  onChange,
}: TechDiagHolderProfileFieldsProps) {
  const cityId = useId();

  /** Меняет виды контроля, выполняемые лабораторией. */
  function changeMethods(methods: string[]) {
    onChange({
      ...value,
      methods,
    });
  }

  /** Меняет город, в котором находится лаборатория. */
  function changeCity(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      organization_city: event.target.value,
    });
  }

  return (
    <FieldStack>
      <ControlMethodsField
        value={value.methods}
        options={options.methods}
        onChange={changeMethods}
      />

      <Field
        label="Где находится организация"
        htmlFor={cityId}
      >
        <TextInput
          id={cityId}
          value={value.organization_city}
          placeholder="Город"
          onChange={changeCity}
        />
      </Field>
    </FieldStack>
  );
}
