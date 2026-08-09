"use client";

import { ORDER_WORK_OPTIONS } from "@/source/entities/order";
import { useSession } from "@/source/features/session";
import type { StepProps } from "./types";
import base from "./sectionBase.module.scss";
import s from "./workTypeSection.module.scss";

export function WorkTypeSection({ state, dispatch }: StepProps) {
  const { user } = useSession();
  const directions = user?.directions ?? [];
  const options = directions.length
    ? ORDER_WORK_OPTIONS.filter((option) => directions.includes(option.value))
    : ORDER_WORK_OPTIONS;

  return (
    <section className={base.section}>
      <span className={`${base.label} ${s.title}`}>Вид работ</span>

      <div className={s.options}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={state.workType === option.value ? `${s.option} ${s.optionActive}` : s.option}
            onClick={() => dispatch({ type: "workType", value: option.value })}
          >
            <strong>{option.label}</strong>
            <span>{option.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
