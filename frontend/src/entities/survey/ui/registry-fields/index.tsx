"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { TextInput } from "@/shared/ui/text-input";
import { YesNoField } from "@/shared/ui/yes-no-field";
import { NRS_NOPRIZ_URL } from "../../config/registry";

/** Регистрационные сведения изыскателя в НРС и СРО. */
interface RegistryFieldsProps {
  nrsNumber: string;
  sroGipDeclared: boolean;
  onNrsNumberChange: (value: string) => void;
  onSroGipDeclaredChange: (value: boolean) => void;
}

/** Номер изыскателя в НРС и участие в СРО в качестве ГИП. */
export function RegistryFields({
  nrsNumber,
  sroGipDeclared,
  onNrsNumberChange,
  onSroGipDeclaredChange,
}: RegistryFieldsProps) {
  const nrsId = useId();

  /** Передаёт номер в реестре специалистов в анкету. */
  function changeNrsNumber(event: ChangeEvent<HTMLInputElement>) {
    onNrsNumberChange(event.target.value);
  }

  return (
    <>
      <Field
        label="Включение в НРС (НОПРИЗ)"
        htmlFor={nrsId}
        link={{
          href: NRS_NOPRIZ_URL,
          text: "Проверить себя в НРС НОПРИЗ",
        }}
      >
        <TextInput
          id={nrsId}
          value={nrsNumber}
          onChange={changeNrsNumber}
          placeholder="Номер в национальном реестре специалистов"
        />
      </Field>

      <Field label="Заявлен какой-либо организацией в СРО как ГИП">
        <YesNoField
          value={sroGipDeclared}
          onChange={onSroGipDeclaredChange}
        />
      </Field>
    </>
  );
}
