import type { BlitzOrder } from "@/entities/blitz-order";

/** Заявка и как показать её новую версию после действия. */
export type BlitzCommandProps = {
  order: BlitzOrder;
  onChange: (order: BlitzOrder) => void;
};
