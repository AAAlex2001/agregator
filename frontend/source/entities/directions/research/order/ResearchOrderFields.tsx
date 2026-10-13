"use client";

import Button from "@/source/shared/ui/Button";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import { TextInput } from "@/source/shared/ui/Inputs";
import { ApplicantFields, Field, FieldStack, RemoveButton } from "../../shared";
import type { ResearchOrderDetails } from "./types";
import s from "./ResearchOrderFields.module.scss";

const REQUIREMENT_HINTS = ["Звание", "Должность", "Стаж"];

interface ResearchOrderFieldsProps {
  value: ResearchOrderDetails;
  onChange: (value: ResearchOrderDetails) => void;
}

/** Заявка на НИР: заявитель, список требований к исполнителю и выезд на объект. */
export function ResearchOrderFields({ value, onChange }: ResearchOrderFieldsProps) {
  const requirements = value.executor_requirements.length ? value.executor_requirements : [""];
  const changeRequirements = (executor_requirements: string[]) => onChange({ ...value, executor_requirements });

  return (
    <FieldStack>
      <Field label="Сведения о заявителе">
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </Field>

      <Field label="Требования к исполнителю" hint={`Например: ${REQUIREMENT_HINTS.join(", ").toLowerCase()}`}>
        {requirements.map((item, index) => (
          <div key={index} className={s.row}>
            <TextInput
              value={item}
              className={s.input}
              placeholder={REQUIREMENT_HINTS[index] ?? "Требование"}
              onChange={(event) =>
                changeRequirements(requirements.map((prev, position) => (position === index ? event.target.value : prev)))
              }
            />
            {requirements.length > 1 && (
              <RemoveButton
                label="Убрать требование"
                onClick={() => changeRequirements([...requirements.slice(0, index), ...requirements.slice(index + 1)])}
              />
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="transparent"
          size="sm"
          className={s.add}
          onClick={() => changeRequirements([...requirements, ""])}
        >
          + Добавить поле
        </Button>
      </Field>

      <Checkbox
        id="research-needs-site-visit"
        checked={value.needs_site_visit}
        onChange={(checked) => onChange({ ...value, needs_site_visit: checked })}
      >
        Необходимость выезда на объект исследований
      </Checkbox>
    </FieldStack>
  );
}
