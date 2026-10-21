import type { BlitzOrder } from "@/entities/blitz-order";

/** Заявка и как показать её новую версию после шага. */
export interface BlitzStepProps {
  order: BlitzOrder;
  onChange: (order: BlitzOrder) => void;
}
