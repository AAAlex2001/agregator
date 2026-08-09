"use client";

import { ORDER_WORK_OPTIONS } from "@/source/entities/order";
import type { StepProps } from "./types";
import base from "./sectionBase.module.scss";
import s from "./workTypeSection.module.scss";

export function WorkTypeSection({ state, dispatch }: StepProps) {
  return (
    <section className={base.section}>
      <span className={`${base.label} ${s.title}`}>Вид работ</span>

      <div className={s.options}>
        {ORDER_WORK_OPTIONS.map((option) => (
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
