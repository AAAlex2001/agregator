"use client";

import type { ChangeEvent } from "react";
import { CalendarInput } from "@/shared/ui/calendar-input";
import { Cell } from "@/shared/ui/cell";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { TextInput } from "@/shared/ui/text-input";
import { CADASTRAL_REGISTRY_URL } from "../../config/registry";

/** Текущие реестровые сведения инженера и обработчики отдельных полей. */
interface RegistryFieldsProps {
  joinedAt: string | null;
  certificateNumber: string | null;
  registryNumber: string | null;
  onJoinedAtChange: (value: string | null) => void;
  onCertificateNumberChange: (value: string) => void;
  onRegistryNumberChange: (value: string) => void;
}

/** Сведения инженера из реестра: дата включения, аттестат и номер. */
export function RegistryFields({
  joinedAt,
  certificateNumber,
  registryNumber,
  onJoinedAtChange,
  onCertificateNumberChange,
  onRegistryNumberChange,
}: RegistryFieldsProps) {
  /** Передаёт выбранную дату или отсутствие даты в анкету. */
  function changeJoinedAt(date: string) {
    onJoinedAtChange(date || null);
  }

  /** Передаёт введённый номер аттестата в анкету. */
  function changeCertificateNumber(event: ChangeEvent<HTMLInputElement>) {
    onCertificateNumberChange(event.target.value);
  }

  /** Передаёт реестровый номер инженера в анкету. */
  function changeRegistryNumber(event: ChangeEvent<HTMLInputElement>) {
    onRegistryNumberChange(event.target.value);
  }

  return (
    <Field
      label="Сведения из реестра кадастровых инженеров"
      link={{
        href: CADASTRAL_REGISTRY_URL,
        text: "Проверить себя в реестре СРО кадастровых инженеров",
      }}
    >
      <FieldStack>
        <Cell label="Дата вступления">
          <CalendarInput
            value={joinedAt ?? ""}
            onChange={changeJoinedAt}
            placeholder="Выберите дату"
          />
        </Cell>
        <Cell label="Номер аттестата">
          <TextInput
            value={certificateNumber ?? ""}
            onChange={changeCertificateNumber}
            placeholder="12-34-5678"
          />
        </Cell>
        <Cell label="Реестровый номер">
          <TextInput
            value={registryNumber ?? ""}
            onChange={changeRegistryNumber}
            placeholder="0000"
          />
        </Cell>
      </FieldStack>
    </Field>
  );
}
