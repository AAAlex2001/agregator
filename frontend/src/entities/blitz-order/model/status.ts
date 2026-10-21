import {
  BLITZ_EXPERT_STATUS_LABELS,
  BLITZ_STATUS_LABELS,
  BLITZ_STEPS,
} from "../config/labels";
import type { BlitzOrder, BlitzStatus } from "./types";

/** Название статуса для того, кто смотрит. */
export function blitzStatusLabel(status: BlitzStatus, isExpert: boolean): string {
  return isExpert ? BLITZ_EXPERT_STATUS_LABELS[status] : BLITZ_STATUS_LABELS[status];
}

/** Номер текущего шага прогресса: замечания — тот же шаг, что работа. */
export function blitzStepIndex(status: BlitzStatus): number {
  return BLITZ_STEPS.indexOf(status === "remarks" ? "in_progress" : status);
}

/** Когда заявка последний раз пришла в статус. */
export function blitzReachedAt(order: BlitzOrder, status: BlitzStatus): string | null {
  const moments = order.history.filter((change) => change.status === status);

  return moments.length > 0 ? moments[moments.length - 1].created_at : null;
}

/** Есть ли подписанный договор. */
export function hasSignedContract(order: BlitzOrder): boolean {
  return order.documents.some((document) => document.kind === "contract");
}
