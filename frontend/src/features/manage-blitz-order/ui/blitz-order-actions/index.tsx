"use client";

import type { BlitzOrder } from "@/entities/blitz-order";
import { CustomerActions } from "../customer-actions";
import { ExpertActions } from "../expert-actions";

/** Заявка, кто смотрит и как показать её новую версию. */
interface BlitzOrderActionsProps {
  order: BlitzOrder;
  isExpert: boolean;
  onChange: (order: BlitzOrder) => void;
}

/** Что сейчас сделать по заявке тому, кто её смотрит. */
export function BlitzOrderActions({ order, isExpert, onChange }: BlitzOrderActionsProps) {
  if (isExpert) {
    return (
      <ExpertActions
        order={order}
        onChange={onChange}
      />
    );
  }

  return (
    <CustomerActions
      order={order}
      onChange={onChange}
    />
  );
}