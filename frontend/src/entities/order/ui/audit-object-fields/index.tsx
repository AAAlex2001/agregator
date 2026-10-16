"use client";

import type { ChangeEvent } from "react";
import { Cell } from "@/shared/ui/cell";
import { FieldStack } from "@/shared/ui/field-stack";
import { TextInput } from "@/shared/ui/text-input";
import type { AuditOrderObject } from "../../model/details/audit";

/** Сведения об одном ОПО и их изменение в условиях аудита. */
interface AuditObjectFieldsProps {
  value: AuditOrderObject;
  onChange: (value: AuditOrderObject) => void;
}

/** Показывает регистрационные данные, адрес и признаки опасности ОПО. */
export function AuditObjectFields({ value, onChange }: AuditObjectFieldsProps) {
  /** Меняет регистрационный номер объекта. */
  function changeRegistrationNumber(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      registration_number: event.target.value,
    });
  }

  /** Меняет наименование объекта. */
  function changeName(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      name: event.target.value,
    });
  }

  /** Меняет класс опасности объекта. */
  function changeHazardClass(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      hazard_class: event.target.value,
    });
  }

  /** Меняет адрес расположения объекта. */
  function changeAddress(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      address: event.target.value,
    });
  }

  /** Меняет отраслевую принадлежность объекта. */
  function changeIndustry(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      industry: event.target.value,
    });
  }

  /** Меняет описание признаков опасности. */
  function changeHazardSigns(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      hazard_signs: event.target.value,
    });
  }

  return (
    <FieldStack>
      <Cell label="Регистрационный номер ОПО">
        <TextInput
          value={value.registration_number}
          onChange={changeRegistrationNumber}
          placeholder="А01-12345-0001"
        />
      </Cell>
      <Cell label="Наименование ОПО">
        <TextInput
          value={value.name}
          onChange={changeName}
          placeholder="Сеть газопотребления"
        />
      </Cell>
      <Cell label="Класс опасности">
        <TextInput
          value={value.hazard_class}
          onChange={changeHazardClass}
          placeholder="III"
        />
      </Cell>
      <Cell label="Адрес местонахождения">
        <TextInput
          value={value.address}
          onChange={changeAddress}
          placeholder="Регион, город, улица"
        />
      </Cell>
      <Cell label="Отраслевая принадлежность">
        <TextInput
          value={value.industry}
          onChange={changeIndustry}
          placeholder="Газоснабжение"
        />
      </Cell>
      <Cell label="Признаки опасности">
        <TextInput
          value={value.hazard_signs}
          onChange={changeHazardSigns}
          placeholder="Использование горючих веществ"
        />
      </Cell>
    </FieldStack>
  );
}
