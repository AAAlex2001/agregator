"use client";

import { useId } from "react";
import { Field } from "@/shared/ui/field";
import { MultiSelect } from "@/shared/ui/multi-select";
import type { TechDiagOption } from "../../model/types";

/** Выбранные виды контроля и доступные варианты для специалиста или лаборатории. */
interface ControlMethodsFieldProps {
  value: string[];
  options: TechDiagOption[];
  onChange: (methods: string[]) => void;
}

/** Выбор видов контроля для специалиста и лаборатории. */
export function ControlMethodsField({
  value,
  options,
  onChange,
}: ControlMethodsFieldProps) {
  const id = useId();
  const methods = options.map((option) => ({
    value: option.code,
    label: option.title,
  }));

  return (
    <Field
      label="Виды неразрушающего контроля"
      htmlFor={id}
    >
      <MultiSelect
        id={id}
        value={value}
        options={methods}
        onChange={onChange}
      />
    </Field>
  );
}
