"use client";

import { useId, type ChangeEvent } from "react";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import { MultiSelect } from "@/shared/ui/multi-select";
import { TextArea } from "@/shared/ui/text-area";
import { toEcologySelectOptions } from "../../model/select-options";
import type { EcologyOptions, EcologyProfileValues } from "../../model/types";

/** Подсказка с примерами практических навыков эколога. */
const SKILLS_PLACEHOLDER = "Знание законодательства, работа с отчётными формами, "
  + "расчёты платы за НВОС, взаимодействие с контролирующими органами";

/** Поля анкеты и доступные виды работ для регистрации или настроек. */
interface EcologyProfileFieldsProps {
  value: EcologyProfileValues;
  options: EcologyOptions;
  onChange: (value: EcologyProfileValues) => void;
  disabled?: boolean;
}

/** Виды работ и навыки эколога для регистрации и настройки профиля. */
export function EcologyProfileFields({
  value,
  options,
  onChange,
  disabled = false,
}: EcologyProfileFieldsProps) {
  const workTypesId = useId();
  const skillsId = useId();

  /** Обновляет виды работ, сохраняя текст навыков. */
  function changeWorkTypes(workTypes: string[]) {
    onChange({
      ...value,
      work_types: workTypes,
    });
  }

  /** Обновляет практические навыки, сохраняя выбранные работы. */
  function changePracticalSkills(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange({
      ...value,
      practical_skills: event.target.value,
    });
  }

  return (
    <FieldStack>
      <Field
        label="Какие виды работ вы выполняете"
        htmlFor={workTypesId}
      >
        <MultiSelect
          id={workTypesId}
          options={toEcologySelectOptions(options.work_types)}
          value={value.work_types}
          onChange={changeWorkTypes}
          disabled={disabled}
        />
      </Field>

      <Field
        label="Практические навыки"
        htmlFor={skillsId}
      >
        <TextArea
          id={skillsId}
          value={value.practical_skills}
          onChange={changePracticalSkills}
          placeholder={SKILLS_PLACEHOLDER}
          maxLength={5000}
          disabled={disabled}
        />
      </Field>
    </FieldStack>
  );
}
