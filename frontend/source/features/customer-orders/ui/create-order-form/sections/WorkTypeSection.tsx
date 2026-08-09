"use client";

import {
  ORDER_WORK_GROUPS,
  orderWorkGroupOf,
  orderWorkOptionsOf,
  type OrderWorkGroup,
} from "@/source/entities/order";
import Tabs from "@/source/shared/ui/Tabs";
import type { StepProps } from "./types";
import base from "./sectionBase.module.scss";
import s from "./workTypeSection.module.scss";

const GROUP_TABS = ORDER_WORK_GROUPS.map((group) => ({ id: group.key, label: group.title }));

export function WorkTypeSection({ state, dispatch }: StepProps) {
  const activeGroup = orderWorkGroupOf(state.workType);

  return (
    <section className={base.section}>
      <span className={`${base.label} ${s.title}`}>Вид работ</span>

      <Tabs
        tabs={GROUP_TABS}
        activeTab={activeGroup}
        onTabChange={(id) =>
          dispatch({ type: "workType", value: orderWorkOptionsOf(id as OrderWorkGroup)[0].value })
        }
        variant="squared"
      />

      <div className={s.options}>
        {orderWorkOptionsOf(activeGroup).map((option) => (
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
