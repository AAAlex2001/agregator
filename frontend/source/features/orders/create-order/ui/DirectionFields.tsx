"use client";

import { DirectionOrderFields, useOrderCatalogs, type DirectionOrderDetails } from "@/source/entities/directions/order";
import type { OrderWorkType } from "@/source/entities/order";
import { FormSection } from "./FormSection";

interface DirectionFieldsProps {
  workType: OrderWorkType;
  value: DirectionOrderDetails;
  onChange: (value: DirectionOrderDetails) => void;
}

/** Анкета выбранного направления со своими справочниками. */
export function DirectionFields({ workType, value, onChange }: DirectionFieldsProps) {
  const catalogs = useOrderCatalogs(workType);
  return (
    <FormSection>
      <DirectionOrderFields workType={workType} value={value} catalogs={catalogs} onChange={onChange} />
    </FormSection>
  );
}
