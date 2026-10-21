import {
  BLITZ_AUDIT_EXPERT_STATUS_LABELS,
  BLITZ_AUDIT_STATUS_LABELS,
  BLITZ_AUDIT_STEPS,
  BLITZ_EXPERT_STATUS_LABELS,
  BLITZ_STATUS_LABELS,
  BLITZ_STEPS,
} from "../config/labels";
import { BLITZ_SECTIONS } from "../config/sections";
import { BLITZ_WORDING } from "../config/wording";
import type { BlitzOrder, BlitzService, BlitzStatus } from "./types";

/** Шаг полосы прогресса для статуса: торг, правки Плана и замечания — внутри своих шагов. */
const STEP_OF_STATUS = {
  new: "new",
  consultation: "new",
  offer: "expert_ready",
  counter: "expert_ready",
  expert_ready: "expert_ready",
  contract: "contract",
  plan: "plan",
  plan_review: "plan",
  in_progress: "in_progress",
  remarks: "in_progress",
  conclusion_ready: "conclusion_ready",
  paid: "paid",
  sent: "sent",
  accepted: "accepted",
  canceled: "canceled",
};

/** Название статуса для того, кто смотрит: у аудита и у исполнителя подписи свои. */
export function blitzStatusLabel(
  status: BlitzStatus,
  isExpert: boolean,
  service: BlitzService,
): string {
  if (service === "audit") {
    return isExpert ? BLITZ_AUDIT_EXPERT_STATUS_LABELS[status] : BLITZ_AUDIT_STATUS_LABELS[status];
  }

  return isExpert ? BLITZ_EXPERT_STATUS_LABELS[status] : BLITZ_STATUS_LABELS[status];
}

/** Шаги прогресса сервиса. */
export function blitzSteps(service: BlitzService): BlitzStatus[] {
  return service === "audit" ? BLITZ_AUDIT_STEPS : BLITZ_STEPS;
}

/** Когда заявка последний раз пришла на шаг прогресса, или null. */
export function blitzStepReachedAt(order: BlitzOrder, step: BlitzStatus): string | null {
  const changes = order.history.filter((change) => STEP_OF_STATUS[change.status] === step);

  return changes.length > 0 ? changes[changes.length - 1].created_at : null;
}

/** Номер текущего шага прогресса. */
export function blitzStepIndex(status: BlitzStatus, service: BlitzService): number {
  return blitzSteps(service).findIndex((step) => step === STEP_OF_STATUS[status]);
}

/** Адрес заявки в разделе её сервиса. */
export function blitzOrderPath(service: BlitzService, orderId: number): string {
  return `${BLITZ_SECTIONS[service]}/orders/${orderId}`;
}

/** Формулировки под сервис заявки. */
export function blitzWording(service: BlitzService) {
  return BLITZ_WORDING[service];
}

/** Руководитель аудиторской группы заявки — тот, кто смотрит. */
export function isAuditLead(order: BlitzOrder, viewerId: number | undefined): boolean {
  return order.team.some((member) => member.lead && member.id === viewerId);
}

/** Готов ли заказчик аудита обсуждать цену. */
export function isNegotiable(order: BlitzOrder): boolean {
  return order.audit_details?.budget.negotiation !== "no";
}
