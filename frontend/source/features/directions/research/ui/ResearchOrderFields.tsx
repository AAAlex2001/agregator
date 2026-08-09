"use client";

import Button from "@/source/shared/ui/Button";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import { TextInput } from "@/source/shared/ui/Inputs";
import { ApplicantFields } from "../../shared/ui/ApplicantFields";
import type { ResearchOrderDetails } from "../model/types";
import s from "../../shared/ui/fields.module.scss";
import own from "./ResearchOrderFields.module.scss";

const REQUIREMENT_HINTS = ["Звание", "Должность", "Стаж"];

interface Props {
  value: ResearchOrderDetails;
  onChange: (value: ResearchOrderDetails) => void;
}

export function ResearchOrderFields({ value, onChange }: Props) {
  const items = value.executor_requirements.length ? value.executor_requirements : [""];

  return (
    <div className={s.form}>
      <div className={s.field}>
        <span className={s.label}>Сведения о заявителе</span>
        <ApplicantFields value={value} onChange={(next) => onChange({ ...value, ...next })} />
      </div>

      <div className={s.field}>
        <span className={s.label}>Требования к исполнителю</span>
        <span className={s.hint}>Например: {REQUIREMENT_HINTS.join(", ").toLowerCase()}</span>
        {items.map((item, index) => (
          <div key={index} className={own.requirementRow}>
            <TextInput
              value={item}
              onChange={(event) =>
                onChange({
                  ...value,
                  executor_requirements: items.map((prev, position) =>
                    position === index ? event.target.value : prev,
                  ),
                })
              }
              placeholder={REQUIREMENT_HINTS[index] ?? "Требование"}
              className={own.requirementInput}
            />
            {items.length > 1 && (
              <button
                type="button"
                className={own.removeRequirement}
                aria-label="Убрать требование"
                onClick={() =>
                  onChange({
                    ...value,
                    executor_requirements: items.filter((prev, position) => position !== index),
                  })
                }
              >
                ×
              </button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="transparent"
          size="sm"
          className={own.addRequirement}
          onClick={() => onChange({ ...value, executor_requirements: [...items, ""] })}
        >
          + Добавить поле
        </Button>
      </div>

      <Checkbox
        id="research-needs-site-visit"
        checked={value.needs_site_visit}
        onChange={(checked) => onChange({ ...value, needs_site_visit: checked })}
      >
        Необходимость выезда на объект исследований
      </Checkbox>
    </div>
  );
}
