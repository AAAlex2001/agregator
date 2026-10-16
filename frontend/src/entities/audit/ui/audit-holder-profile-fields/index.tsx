import type { ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { MultiSelect } from "@/shared/ui/multi-select";
import { TextInput } from "@/shared/ui/text-input";
import type {
  AuditHolderProfileValues,
  AuditOptions,
} from "../../model/types";

/** Свидетельство инспекционного органа и варианты областей аккредитации. */
interface AuditHolderProfileFieldsProps {
  value: AuditHolderProfileValues;
  options: AuditOptions;
  onChange: (profile: AuditHolderProfileValues) => void;
}

/** Показывает свидетельство и области аккредитации инспекционного органа. */
export function AuditHolderProfileFields({
  value,
  options,
  onChange,
}: AuditHolderProfileFieldsProps) {
  /** Меняет номер свидетельства об аккредитации. */
  function changeCertificateNumber(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...value,
      certificate_number: event.target.value,
    });
  }

  /** Меняет выбранные области аккредитации органа. */
  function changeAccreditationAreas(areas: string[]) {
    onChange({
      ...value,
      accreditation_areas: areas,
    });
  }

  return (
    <FieldStack>
      <Field label="№ свидетельства об аккредитации">
        <TextInput
          value={value.certificate_number}
          onChange={changeCertificateNumber}
          placeholder="RA.RU.010001"
        />
      </Field>
      <Field label="Области аккредитации по аудиту СУПБ">
        <MultiSelect
          id="audit-holder-accreditation"
          options={options.accreditationAreas}
          value={value.accreditation_areas}
          onChange={changeAccreditationAreas}
        />
      </Field>
    </FieldStack>
  );
}
