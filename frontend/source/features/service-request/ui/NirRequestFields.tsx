"use client";

import Button from "@/source/shared/ui/Button";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import { TextInput } from "@/source/shared/ui/Inputs";
import { EXECUTOR_REQUIREMENT_HINTS } from "@/source/entities/order";
import type { ServiceRequestState } from "../model/types";
import { Field } from "./Field";
import s from "./service-request-form.module.scss";

interface Props {
  state: ServiceRequestState;
  onTopicChange: (value: string) => void;
  onToggleSiteVisit: () => void;
  onAddRequirement: () => void;
  onSetRequirement: (id: number, value: string) => void;
  onRemoveRequirement: (id: number) => void;
}

export function NirRequestFields({
  state,
  onTopicChange,
  onToggleSiteVisit,
  onAddRequirement,
  onSetRequirement,
  onRemoveRequirement,
}: Props) {
  return (
    <>
      <Field label="Тема">
        <TextInput
          value={state.topic}
          required
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="Тема научно-исследовательской работы"
        />
      </Field>

      <div className={s.field}>
        <span className={s.label}>Требования к исполнителю</span>
        {state.executorRequirements.map((item) => (
          <div key={item.id} className={s.reqRow}>
            <TextInput
              className={s.reqInput}
              value={item.value}
              onChange={(e) => onSetRequirement(item.id, e.target.value)}
              placeholder={EXECUTOR_REQUIREMENT_HINTS.join(", ").toLowerCase()}
            />
            {state.executorRequirements.length > 1 && (
              <button
                type="button"
                className={s.reqRemove}
                onClick={() => onRemoveRequirement(item.id)}
                aria-label="Удалить требование"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <Button type="button" variant="transparent" size="sm" onClick={onAddRequirement}>
          + Добавить поле
        </Button>
      </div>

      <Checkbox id="site-visit" checked={state.needsSiteVisit} onChange={onToggleSiteVisit}>
        Необходимость выезда на объект исследований
      </Checkbox>
    </>
  );
}
