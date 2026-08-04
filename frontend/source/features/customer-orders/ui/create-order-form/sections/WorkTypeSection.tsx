"use client";

import type { UseFormReturn } from "react-hook-form";
import Tabs from "@/source/shared/ui/Tabs";
import {
  ORDER_WORK_GROUPS,
  orderWorkGroupOf,
  orderWorkOptionsOf,
  type OrderWorkGroup,
  type OrderWorkType,
} from "@/source/entities/order";
import { emptyDirectionDetails } from "../../../model/orderDetails";
import type { OrderFormValues } from "../../../model/schema";
import base from "./sectionBase.module.scss";
import s from "./workTypeSection.module.scss";

const GROUP_TABS = ORDER_WORK_GROUPS.map((group) => ({ id: group.key, label: group.title }));

interface Props {
  form: UseFormReturn<OrderFormValues>;
}

export function WorkTypeSection({ form }: Props) {
  const { watch, setValue } = form;
  const workType = watch("workType");
  const activeGroup = orderWorkGroupOf(workType);

  const choose = (value: OrderWorkType) => {
    if (value === workType) return;
    setValue("workType", value, { shouldDirty: true, shouldValidate: true });
    const empties = emptyDirectionDetails();
    setValue("cadastralDetails", empties.cadastralDetails, { shouldDirty: true });
    setValue("forensicDetails", empties.forensicDetails, { shouldDirty: true });
    setValue("researchDetails", empties.researchDetails, { shouldDirty: true });
    setValue("laboratoryDetails", empties.laboratoryDetails, { shouldDirty: true });
    setValue("auditDetails", empties.auditDetails, { shouldDirty: true });
    if (value === "EXPERTISE") return;
    setValue("selectionsByType", {}, { shouldDirty: true });
    setValue("requiresExpert", true, { shouldDirty: true, shouldValidate: true });
    setValue("requiresLicense", false, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <section className={base.section}>
      <span className={`${base.label} ${s.title}`}>Вид работ</span>

      <Tabs
        tabs={GROUP_TABS}
        activeTab={activeGroup}
        onTabChange={(id) => choose(orderWorkOptionsOf(id as OrderWorkGroup)[0].value)}
        variant="squared"
      />

      <div className={s.options}>
        {orderWorkOptionsOf(activeGroup).map((option) => (
          <button
            key={option.value}
            type="button"
            className={workType === option.value ? `${s.option} ${s.optionActive}` : s.option}
            onClick={() => choose(option.value)}
          >
            <strong>{option.label}</strong>
            <span>{option.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
