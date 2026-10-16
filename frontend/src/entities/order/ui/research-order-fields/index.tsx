"use client";

import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Field } from "@/shared/ui/field";
import { FieldStack } from "@/shared/ui/field-stack";
import type { OrderApplicant } from "../../model/details/applicant";
import type { ResearchOrderDetails } from "../../model/details/research";
import { OrderApplicantFields } from "../order-applicant-fields";
import { ResearchRequirementField } from "../research-requirement-field";
import styles from "./style.module.scss";

/** Примеры первых требований к исполнителю научно-исследовательской работы. */
const REQUIREMENT_HINTS = ["Звание", "Должность", "Стаж"];

/** Условия научно-исследовательской работы и их изменение в форме заказа. */
interface ResearchOrderFieldsProps {
  value: ResearchOrderDetails;
  onChange: (value: ResearchOrderDetails) => void;
}

/** Показывает заявителя, список требований и необходимость выезда на объект. */
export function ResearchOrderFields({ value, onChange }: ResearchOrderFieldsProps) {
  const requirements = value.executor_requirements.length > 0
    ? value.executor_requirements
    : [""];

  /** Обновляет сведения о заявителе, сохраняя требования к исполнителю. */
  function changeApplicant(applicant: OrderApplicant) {
    onChange({
      ...value,
      ...applicant,
    });
  }

  /** Обновляет текст одной строки требований. */
  function changeRequirement(index: number, text: string) {
    onChange({
      ...value,
      executor_requirements: requirements.with(index, text),
    });
  }

  /** Убирает выбранную строку требований, сохраняя порядок остальных. */
  function removeRequirement(index: number) {
    onChange({
      ...value,
      executor_requirements: requirements.toSpliced(index, 1),
    });
  }

  /** Добавляет пустую строку для дополнительного требования. */
  function addRequirement() {
    onChange({
      ...value,
      executor_requirements: [...requirements, ""],
    });
  }

  /** Меняет необходимость выезда исполнителя на объект исследований. */
  function changeSiteVisit(isRequired: boolean) {
    onChange({
      ...value,
      needs_site_visit: isRequired,
    });
  }

  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <OrderApplicantFields
          value={value}
          onChange={changeApplicant}
        />
      </Field>
      <Field
        label="Требования к исполнителю"
        hint={`Например: ${REQUIREMENT_HINTS.join(", ").toLowerCase()}`}
      >
        {requirements.map((requirement, index) => (
          <ResearchRequirementField
            key={index}
            index={index}
            value={requirement}
            placeholder={REQUIREMENT_HINTS[index] ?? "Требование"}
            canRemove={requirements.length > 1}
            onChange={changeRequirement}
            onRemove={removeRequirement}
          />
        ))}
        <Button
          type="button"
          variant="transparent"
          size="sm"
          className={styles.add}
          onClick={addRequirement}
        >
          + Добавить поле
        </Button>
      </Field>
      <Checkbox
        id="research-needs-site-visit"
        checked={value.needs_site_visit}
        onChange={changeSiteVisit}
      >
        Необходимость выезда на объект исследований
      </Checkbox>
    </FieldStack>
  );
}
