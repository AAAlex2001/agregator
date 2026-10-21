import { blitzCompanyProblem, parseBlitzPrice } from "@/entities/blitz-order";
import type { BlitzAuditAttachments } from "@/entities/blitz-order";
import { AUDIT_STEPS } from "../config/steps";
import type { AuditStep } from "../config/steps";
import { asksSto } from "./payload";
import type { CreateBlitzAuditState } from "./types";

/** Ошибка шага и номер шага, где её исправить. */
export interface AuditStepProblem {
  step: number;
  problem: string;
}

/** Что не так с представителем заказчика, или null. */
function applicantProblem(state: CreateBlitzAuditState): string | null {
  const { applicant } = state;

  if (!applicant.full_name.trim() || !applicant.position.trim() || !applicant.organization.trim()) {
    return "Заполните сведения о представителе заказчика";
  }

  if (!/^\d{10}(\d{2})?$/.test(applicant.inn.trim())) {
    return "ИНН организации — 10 или 12 цифр";
  }

  if (!applicant.phone.trim() || !applicant.email.trim()) {
    return "Укажите телефон и почту представителя";
  }

  return null;
}

/** Что не так с объектами аудита, или null. */
function objectsProblem(state: CreateBlitzAuditState): string | null {
  if (state.scope === "all") {
    const count = Number(state.fleet.count);
    const isFilled = count >= 1 && state.fleet.profile.trim() && state.fleet.multi_region !== null;

    return isFilled ? null : "Заполните сведения об ОПО организации";
  }

  const incomplete = state.objects.some((item) => (
    !item.reg_number.trim()
      || !item.name.trim()
      || !item.hazard_class
      || !item.address.trim()
      || !item.industry.trim()
      || item.hazard_signs.length === 0
  ));

  return incomplete ? "Заполните сведения обо всех ОПО" : null;
}

/** Что не так с этапами, типом аудита и его уточнениями, или null. */
function paramsProblem(state: CreateBlitzAuditState): string | null {
  if (state.stages.length === 0) {
    return "Выберите этапы аудита";
  }

  if (!state.kind) {
    return "Выберите тип аудита";
  }

  if (asksSto(state.kind) && state.useSto === null) {
    return "Укажите, учитывать ли СТО организации";
  }

  if (state.useSto && asksSto(state.kind) && !state.stoName.trim()) {
    return "Укажите наименование и реквизиты СТО";
  }

  if (state.kind === "selective" && state.elements.length === 0) {
    return "Выберите направления выборочного аудита";
  }

  return null;
}

/** Что не так со сроками и ценой, или null. */
function termsProblem(state: CreateBlitzAuditState, minPrice: number): string | null {
  if (state.timing === "custom" && (!state.timingStart || !state.timingEnd)) {
    return "Укажите период проведения аудита";
  }

  if (state.budget === "custom" && !(parseBlitzPrice(state.price) >= minPrice)) {
    return `Стоимость аудита — не менее ${minPrice.toLocaleString("ru-RU")} ₽`;
  }

  return null;
}

/** Каких отдельных файлов не хватает, или null. */
function documentsProblem(
  state: CreateBlitzAuditState,
  attachments: BlitzAuditAttachments,
): string | null {
  if (state.applicant.by_proxy && !attachments.powerOfAttorney) {
    return "Приложите доверенность";
  }

  if (state.useSto && asksSto(state.kind) && !attachments.stoFile) {
    return "Приложите файл СТО";
  }

  return null;
}

/** Что не так на шаге, или null, если можно идти дальше. */
export function auditStepProblem(
  step: AuditStep,
  state: CreateBlitzAuditState,
  attachments: BlitzAuditAttachments,
  minPrice: number,
): string | null {
  switch (step) {
    case "applicant":
      return applicantProblem(state);
    case "objects":
      return objectsProblem(state);
    case "params":
      return paramsProblem(state);
    case "terms":
      return termsProblem(state, minPrice);
    case "documents":
      return documentsProblem(state, attachments);
    case "customer":
      return blitzCompanyProblem(state.company);
    case "comment":
      return null;
  }
}

/** Первый шаг с ошибкой перед отправкой, или null. */
export function firstAuditProblem(
  state: CreateBlitzAuditState,
  attachments: BlitzAuditAttachments,
  minPrice: number,
): AuditStepProblem | null {
  for (const [step, item] of AUDIT_STEPS.entries()) {
    const problem = auditStepProblem(item.key, state, attachments, minPrice);

    if (problem) {
      return { step, problem };
    }
  }

  return null;
}