"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { TextInput } from "@/shared/ui/text-input";
import { SRO_REGISTRY_URL } from "../../config/registry";
import { SRO_LABELS } from "../../config/options";
import type { SroDirection } from "../../model/types";

/** Название и регистрационный номер члена СРО выбранного направления. */
interface MembershipFieldsProps {
  direction: SroDirection;
  name: string;
  registryNumber: string;
  onNameChange: (name: string) => void;
  onRegistryNumberChange: (number: string) => void;
}

/** Название СРО и номер организации в реестре её членов. */
export function MembershipFields({
  direction,
  name,
  registryNumber,
  onNameChange,
  onRegistryNumberChange,
}: MembershipFieldsProps) {
  const nameId = useId();
  const registryId = useId();

  /** Передаёт введённое название саморегулируемой организации. */
  function changeName(event: ChangeEvent<HTMLInputElement>) {
    onNameChange(event.target.value);
  }

  /** Передаёт введённый номер в реестре членов СРО. */
  function changeRegistryNumber(event: ChangeEvent<HTMLInputElement>) {
    onRegistryNumberChange(event.target.value);
  }

  return (
    <>
      <Field
        label={SRO_LABELS[direction].name}
        htmlFor={nameId}
      >
        <TextInput
          id={nameId}
          value={name}
          placeholder="Полное наименование саморегулируемой организации"
          onChange={changeName}
        />
      </Field>

      <Field
        label="Номер в реестре членов СРО"
        htmlFor={registryId}
        link={{
          href: SRO_REGISTRY_URL,
          text: "Проверить организацию в едином реестре НОПРИЗ",
        }}
      >
        <TextInput
          id={registryId}
          value={registryNumber}
          placeholder="Регистрационный номер в реестре членов"
          onChange={changeRegistryNumber}
        />
      </Field>
    </>
  );
}
