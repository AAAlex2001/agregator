import type { RateRtnProps } from "../../model/types";
import { RtnRating } from "../rtn-rating";

/** Начинает отдельное состояние оценки при переходе к другому разъяснению. */
export function RateRtn({ clarificationId, initial }: RateRtnProps) {
  return (
    <RtnRating
      key={clarificationId}
      clarificationId={clarificationId}
      initial={initial}
    />
  );
}
