"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { MultiSelect } from "@/shared/ui/multi-select";
import { TextArea } from "@/shared/ui/text-area";
import type { TechDiagOptions, TechDiagProfileValues } from "../../model/types";
import { ControlMethodsField } from "../control-methods-field";

/** Редактируемая анкета специалиста НК и варианты из справочников. */
interface TechDiagProfileFieldsProps {
  value: TechDiagProfileValues;
  options: TechDiagOptions;
  onChange: (value: TechDiagProfileValues) => void;
}

/** Удостоверения специалиста, виды контроля и объекты по СДАНК-02-2020. */
export function TechDiagProfileFields({
  value,
  options,
  onChange,
}: TechDiagProfileFieldsProps) {
  const certificatesId = useId();
  const objectsId = useId();
  const objects = options.control_objects.map((option) => ({
    value: option.code,
    label: option.title,
  }));

  /** Обновляет описание квалификационных удостоверений. */
  function changeCertificates(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      qualification_certificates: event.target.value,
    });
  }

  /** Обновляет выбранные виды неразрушающего контроля. */
  function changeMethods(methods: string[]) {
    onChange({
      ...value,
      methods,
    });
  }

  /** Обновляет выбранные объекты контроля. */
  function changeControlObjects(controlObjects: string[]) {
    onChange({
      ...value,
      control_objects: controlObjects,
    });
  }

  return (
    <FieldStack>
      <Field
        label="Квалификационные удостоверения"
        htmlFor={certificatesId}
      >
        <TextArea
          id={certificatesId}
          value={value.qualification_certificates}
          placeholder="Номера удостоверений, уровни квалификации и методы контроля"
          maxLength={5000}
          onChange={changeCertificates}
        />
      </Field>

      <ControlMethodsField
        value={value.methods}
        options={options.methods}
        onChange={changeMethods}
      />

      <Field
        label="Объекты контроля согласно СДАНК-02-2020"
        htmlFor={objectsId}
      >
        <MultiSelect
          id={objectsId}
          value={value.control_objects}
          options={objects}
          onChange={changeControlObjects}
        />
      </Field>
    </FieldStack>
  );
}
