"use client";

import { useId } from "react";
import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { GeoSuggestInput } from "@/shared/ui/geo-suggest-input";
import { TextArea } from "@/shared/ui/text-area";
import { TextInput } from "@/shared/ui/text-input";
import { YesNoField } from "@/shared/ui/yes-no-field";
import type { CadastralProfileValues } from "../../model/types";
import { RegistryFields } from "../registry-fields";

/** Редактируемые сведения инженера и передача изменений в форму. */
interface CadastralProfileFieldsProps {
  value: CadastralProfileValues;
  onChange: (value: CadastralProfileValues) => void;
}

/** Поля кадастрового инженера для регистрации и редактирования профиля. */
export function CadastralProfileFields({
  value,
  onChange,
}: CadastralProfileFieldsProps) {
  const educationId = useId();
  const workplaceId = useId();

  /** Обновляет описание образования инженера. */
  function changeEducation(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      education: event.target.value,
    });
  }

  /** Обновляет дату вступления в реестр. */
  function changeJoinedAt(joinedAt: string | null) {
    onChange({
      ...value,
      registry_joined_at: joinedAt,
    });
  }

  /** Обновляет номер квалификационного аттестата. */
  function changeCertificateNumber(certificateNumber: string) {
    onChange({
      ...value,
      certificate_number: certificateNumber,
    });
  }

  /** Обновляет номер инженера в реестре. */
  function changeRegistryNumber(registryNumber: string) {
    onChange({
      ...value,
      registry_number: registryNumber,
    });
  }

  /** Отмечает наличие оборудования для кадастровых работ. */
  function changeEquipment(hasEquipment: boolean) {
    onChange({
      ...value,
      has_equipment: hasEquipment,
    });
  }

  /** Обновляет город инженера. */
  function changeCity(city: string) {
    onChange({
      ...value,
      city,
    });
  }

  /** Обновляет место работы инженера. */
  function changeWorkplace(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      workplace: event.target.value,
    });
  }

  return (
    <FieldStack>
      <Field
        label="Образование"
        htmlFor={educationId}
      >
        <TextArea
          id={educationId}
          value={value.education}
          onChange={changeEducation}
          placeholder="Учебное заведение, специальность, год окончания"
          maxLength={5000}
        />
      </Field>

      <RegistryFields
        joinedAt={value.registry_joined_at}
        certificateNumber={value.certificate_number}
        registryNumber={value.registry_number}
        onJoinedAtChange={changeJoinedAt}
        onCertificateNumberChange={changeCertificateNumber}
        onRegistryNumberChange={changeRegistryNumber}
      />

      <Field label="Наличие необходимого оборудования">
        <YesNoField
          value={value.has_equipment}
          onChange={changeEquipment}
        />
      </Field>

      <Field label="Местонахождение">
        <GeoSuggestInput
          value={value.city}
          onChange={changeCity}
          placeholder="Город"
        />
      </Field>

      <Field
        label="Место работы"
        htmlFor={workplaceId}
      >
        <TextInput
          id={workplaceId}
          value={value.workplace}
          onChange={changeWorkplace}
          placeholder="Организация или «индивидуальный предприниматель»"
        />
      </Field>
    </FieldStack>
  );
}
