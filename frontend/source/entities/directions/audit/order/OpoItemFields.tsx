"use client";

import { TextInput } from "@/source/shared/ui/Inputs";
import { Cell, FieldStack } from "../../shared";
import type { AuditOpoItem } from "./types";

interface OpoItemFieldsProps {
  value: AuditOpoItem;
  onChange: (value: AuditOpoItem) => void;
}

/** Сведения об одном опасном производственном объекте. */
export function OpoItemFields({ value, onChange }: OpoItemFieldsProps) {
  return (
    <FieldStack>
      <Cell label="Регистрационный номер ОПО">
        <TextInput
          value={value.registration_number}
          onChange={(event) => onChange({ ...value, registration_number: event.target.value })}
          placeholder="А01-12345-0001"
        />
      </Cell>
      <Cell label="Наименование ОПО">
        <TextInput
          value={value.name}
          onChange={(event) => onChange({ ...value, name: event.target.value })}
          placeholder="Сеть газопотребления"
        />
      </Cell>
      <Cell label="Класс опасности">
        <TextInput
          value={value.hazard_class}
          onChange={(event) => onChange({ ...value, hazard_class: event.target.value })}
          placeholder="III"
        />
      </Cell>
      <Cell label="Адрес местонахождения">
        <TextInput
          value={value.address}
          onChange={(event) => onChange({ ...value, address: event.target.value })}
          placeholder="Регион, город, улица"
        />
      </Cell>
      <Cell label="Отраслевая принадлежность">
        <TextInput
          value={value.industry}
          onChange={(event) => onChange({ ...value, industry: event.target.value })}
          placeholder="Газоснабжение"
        />
      </Cell>
      <Cell label="Признаки опасности">
        <TextInput
          value={value.hazard_signs}
          onChange={(event) => onChange({ ...value, hazard_signs: event.target.value })}
          placeholder="Использование горючих веществ"
        />
      </Cell>
    </FieldStack>
  );
}
