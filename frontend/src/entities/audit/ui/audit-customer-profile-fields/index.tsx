import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { TextInput } from "@/shared/ui/text-input";
import type { AuditCustomerProfileValues } from "../../model/types";

/** Поля заказчика аудита и действие замены анкеты. */
interface AuditCustomerProfileFieldsProps {
  value: AuditCustomerProfileValues;
  onChange: (profile: AuditCustomerProfileValues) => void;
}

/** Показывает должность представителя и лицензию заказчика аудита. */
export function AuditCustomerProfileFields({
  value,
  onChange,
}: AuditCustomerProfileFieldsProps) {
  /** Меняет должность представителя заказчика. */
  function changePosition(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      position: event.target.value,
    });
  }

  /** Меняет номер лицензии на эксплуатацию опасного объекта. */
  function changeLicenseNumber(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      opo_license_number: event.target.value,
    });
  }

  return (
    <FieldStack>
      <Field label="Должность представителя">
        <TextInput
          value={value.position}
          onChange={changePosition}
          placeholder="Главный инженер"
        />
      </Field>
      <Field label="Лицензия на эксплуатацию ОПО (при наличии)">
        <TextInput
          value={value.opo_license_number}
          onChange={changeLicenseNumber}
          placeholder="Номер лицензии"
        />
      </Field>
    </FieldStack>
  );
}
