import type { ChangeEvent } from "react";
import { EmailInput } from "@/shared/ui/email-input";
import { PhoneInput } from "@/shared/ui/phone-input";
import { TextInput } from "@/shared/ui/text-input";
import type { LeadFormFields, LeadTextField } from "../../model/types";
import { LeadField } from "../lead-field";

/** Контактные поля заявки и обработчик их изменения. */
interface ContactFieldsProps {
  fields: LeadFormFields;
  onChange: (field: LeadTextField, value: string) => void;
}

/** Показывает контакты посетителя, организацию и регион работ. */
export function ContactFields({ fields, onChange }: ContactFieldsProps) {
  /** Обновляет имя посетителя. */
  function changeName(event: ChangeEvent<HTMLInputElement>) {
    onChange("name", event.target.value);
  }

  /** Обновляет контактный телефон. */
  function changePhone(event: ChangeEvent<HTMLInputElement>) {
    onChange("phone", event.target.value);
  }

  /** Обновляет адрес электронной почты. */
  function changeEmail(event: ChangeEvent<HTMLInputElement>) {
    onChange("email", event.target.value);
  }

  /** Обновляет название организации. */
  function changeCompany(event: ChangeEvent<HTMLInputElement>) {
    onChange("company", event.target.value);
  }

  /** Обновляет ИНН организации. */
  function changeInn(event: ChangeEvent<HTMLInputElement>) {
    onChange("inn", event.target.value);
  }

  /** Обновляет регион или город выполнения работ. */
  function changeRegion(event: ChangeEvent<HTMLInputElement>) {
    onChange("region", event.target.value);
  }

  return (
    <>
      <LeadField label="Ваше имя *">
        <TextInput
          required
          placeholder="Иван Иванович"
          value={fields.name}
          onChange={changeName}
        />
      </LeadField>
      <LeadField label="Телефон *">
        <PhoneInput
          required
          placeholder="+7-999-000-00-00"
          value={fields.phone}
          onChange={changePhone}
        />
      </LeadField>
      <LeadField label="Email">
        <EmailInput
          placeholder="mail@example.com"
          value={fields.email}
          onChange={changeEmail}
        />
      </LeadField>
      <LeadField label="Организация">
        <TextInput
          placeholder="ООО «Пример»"
          value={fields.company}
          onChange={changeCompany}
        />
      </LeadField>
      <LeadField label="ИНН">
        <TextInput
          placeholder="10 или 12 цифр"
          value={fields.inn}
          onChange={changeInn}
        />
      </LeadField>
      <LeadField label="Регион, город">
        <TextInput
          placeholder="Например: Кемеровская область"
          value={fields.region}
          onChange={changeRegion}
        />
      </LeadField>
    </>
  );
}
